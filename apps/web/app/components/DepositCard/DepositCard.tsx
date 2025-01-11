"use client";

import { Decimal } from "@cosmjs/math";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import AnimatedArrowSpacer from "components/AnimatedDownArrowSpacer/AnimatedDownArrowSpacer";
import Dropdown from "components/Dropdown/Dropdown";
import { sendIbcTransfer, useCosmosWallet } from "features/CosmosWallet";
import { AddErc20ToWalletButton, useEvmWallet } from "features/EvmWallet";
import { NotificationType, useNotifications } from "features/Notifications";

export default function DepositCard(): React.ReactElement {
  const { addNotification } = useNotifications();

  const {
    evmAccountAddress,
    selectEvmChain,
    evmChainsOptions,
    selectedEvmChain,
    selectedEvmChainOption,
    defaultEvmCurrencyOption,
    selectEvmCurrency,
    evmCurrencyOptions,
    selectedEvmCurrencyBalance,
    isLoadingSelectedEvmCurrencyBalance,
    connectEvmWallet,
    resetState: resetEvmWalletState,
  } = useEvmWallet();

  const {
    cosmosAccountAddress: fromAddress,
    selectCosmosChain,
    cosmosChainsOptions,
    selectedCosmosChain,
    selectedCosmosChainOption,
    defaultIbcCurrencyOption,
    selectIbcCurrency,
    selectedIbcCurrency,
    ibcCurrencyOptions,
    cosmosBalance,
    isLoadingCosmosBalance,
    connectCosmosWallet,
    getCosmosSigningClient,
  } = useCosmosWallet();

  // ensure cosmos wallet connection when selected ibc chain changes
  useEffect(() => {
    if (!selectedCosmosChain) {
      return;
    }
    connectCosmosWallet();
  }, [selectedCosmosChain, connectCosmosWallet]);

  // the evm currency selection is controlled by the sender's chosen ibc currency,
  // and should be updated when an ibc currency or evm chain is selected
  const selectedEvmCurrencyOption = useMemo(() => {
    if (!selectedIbcCurrency) {
      return defaultEvmCurrencyOption;
    }
    const matchingEvmCurrency = selectedEvmChain?.currencies.find(
      (currency) => currency.coinDenom === selectedIbcCurrency.coinDenom,
    );
    if (!matchingEvmCurrency) {
      return null;
    }
    return {
      label: matchingEvmCurrency.coinDenom,
      value: matchingEvmCurrency,
      leftIconClass: matchingEvmCurrency.iconClass,
    };
  }, [selectedIbcCurrency, selectedEvmChain, defaultEvmCurrencyOption]);

  const [amount, setAmount] = useState<string>("");
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false);
  const [isRecipientAddressValid, setIsRecipientAddressValid] =
    useState<boolean>(false);
  const [hasTouchedForm, setHasTouchedForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // recipientAddressOverride is used to allow manual entry of an address
  const [recipientAddressOverride, setRecipientAddressOverride] =
    useState<string>("");
  const [isRecipientAddressEditable, setIsRecipientAddressEditable] =
    useState<boolean>(false);
  const handleEditRecipientClick = useCallback(() => {
    setIsRecipientAddressEditable(!isRecipientAddressEditable);
  }, [isRecipientAddressEditable]);
  const handleEditRecipientSave = () => {
    setIsRecipientAddressEditable(false);
    // reset evmWalletState when user manually enters address
    resetEvmWalletState();
  };
  const handleEditRecipientClear = () => {
    setIsRecipientAddressEditable(false);
    setRecipientAddressOverride("");
  };
  const updateRecipientAddressOverride = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRecipientAddressOverride(event.target.value);
  };

  // check if form is valid whenever values change
  useEffect(() => {
    if (evmAccountAddress || amount || recipientAddressOverride) {
      // have touched form when evmAccountAddress or amount change
      setHasTouchedForm(true);
    }
    const recipientAddress = recipientAddressOverride || evmAccountAddress;
    checkIsFormValid(recipientAddress, amount);
  }, [evmAccountAddress, amount, recipientAddressOverride]);

  const updateAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const checkIsFormValid = (
    addressInput: string | null,
    amountInput: string,
  ) => {
    if (addressInput === null) {
      setIsRecipientAddressValid(false);
      return;
    }
    // check that address is correct evm address format
    if (!addressInput.startsWith("0x")) {
      setIsRecipientAddressValid(false);
      return;
    }

    const amount = Number.parseFloat(amountInput);
    const amountValid = amount > 0;
    setIsAmountValid(amountValid);
    // TODO - what validation should we do?
    const addressValid = addressInput.length > 0;
    setIsRecipientAddressValid(addressValid);
  };

  const handleConnectEvmWallet = useCallback(() => {
    // clear recipient address override values when user attempts to connect evm wallet
    setIsRecipientAddressEditable(false);
    setRecipientAddressOverride("");
    connectEvmWallet();
  }, [connectEvmWallet]);

  // ensure evm wallet connection when selected EVM chain changes
  useEffect(() => {
    if (!selectedEvmChain) {
      return;
    }
    // FIXME - there is a bad implicit loop of logic here.
    //  1. user can click "Connect EVM Wallet", which calls `connectEvmWallet`, before selecting a chain
    //  2. `connectEvmWallet` will set the selected evm chain if it's not set
    //  3. this `useEffect` is then triggered, which ultimately calls `connectEvmWallet`,
    //     but now a chain is set so it will open the connect modal
    console.log("useEffect handle connect evm wallet");
    handleConnectEvmWallet();
  }, [selectedEvmChain, handleConnectEvmWallet]);

  const handleDeposit = async () => {
    if (!selectedCosmosChain || !selectedIbcCurrency) {
      addNotification({
        toastOpts: {
          toastType: NotificationType.WARNING,
          message: "Please select a chain and token to bridge first.",
          onAcknowledge: () => {},
        },
      });
      return;
    }

    const recipientAddress = recipientAddressOverride || evmAccountAddress;
    if (!fromAddress || !recipientAddress) {
      addNotification({
        toastOpts: {
          toastType: NotificationType.WARNING,
          message: "Please connect your Keplr and EVM wallet first.",
          onAcknowledge: () => {},
        },
      });
      return;
    }

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const formattedAmount = Decimal.fromUserInput(
        amount,
        selectedIbcCurrency.coinDecimals,
      ).atomics;

      const signer = await getCosmosSigningClient();
      await sendIbcTransfer(
        signer,
        fromAddress,
        recipientAddress,
        formattedAmount,
        selectedIbcCurrency,
      );
      addNotification({
        toastOpts: {
          toastType: NotificationType.SUCCESS,
          message: "Deposit successful!",
          onAcknowledge: () => {},
        },
      });
    } catch (e) {
      setIsAnimating(false);
      console.error("IBC transfer failed", e);
      const message = e instanceof Error ? e.message : "Unknown error.";
      if (/failed to get account from keplr wallet/i.test(message)) {
        addNotification({
          toastOpts: {
            toastType: NotificationType.DANGER,
            message:
              "Failed to get account from Keplr wallet. Does this address have funds for the selected chain?",
            onAcknowledge: () => {},
          },
        });
      } else {
        addNotification({
          toastOpts: {
            toastType: NotificationType.DANGER,
            component: (
              <>
                <p className="mb-1">Failed to send IBC transfer.</p>
                <p className="message-body-inner">{message}</p>
              </>
            ),
            onAcknowledge: () => {},
          },
        });
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  // disable deposit button if form is invalid
  const isDepositDisabled = useMemo<boolean>((): boolean => {
    if (recipientAddressOverride) {
      // there won't be a selected evm chain and currency if user manually
      // enters a recipient address
      return !(isAmountValid && isRecipientAddressValid && fromAddress);
    }
    return !(
      evmAccountAddress &&
      isAmountValid &&
      isRecipientAddressValid &&
      fromAddress &&
      selectedIbcCurrency?.coinDenom ===
        selectedEvmCurrencyOption?.value?.coinDenom
    );
  }, [
    recipientAddressOverride,
    evmAccountAddress,
    isAmountValid,
    isRecipientAddressValid,
    fromAddress,
    selectedIbcCurrency,
    selectedEvmCurrencyOption,
  ]);

  const additionalIbcChainOptions = useMemo(
    () => [
      {
        label: "Connect Cosmos Wallet",
        action: connectCosmosWallet,
        className: "has-text-primary",
        leftIconClass: "i-cosmos",
        rightIconClass: "fas fa-plus",
      },
    ],
    [connectCosmosWallet],
  );

  const additionalEvmChainOptions = useMemo(() => {
    return [
      {
        label: "Connect EVM Wallet",
        action: handleConnectEvmWallet,
        className: "has-text-primary",
        rightIconClass: "fas fa-plus",
      },
      {
        label: "Enter address manually",
        action: handleEditRecipientClick,
        className: "has-text-primary",
        rightIconClass: "fas fa-pen-to-square",
      },
    ];
  }, [handleConnectEvmWallet, handleEditRecipientClick]);

  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-col">
          <div className="flex flex-row items-center mb-3">
            <div className="mr-4 min-w-[70px] md:min-w-[60px]">From</div>
            <div className="flex-grow">
              <Dropdown
                placeholder="Select..."
                options={cosmosChainsOptions}
                onSelect={selectCosmosChain}
                leftIconClass={"i-wallet"}
                additionalOptions={additionalIbcChainOptions}
                valueOverride={selectedCosmosChainOption}
              />
            </div>
            {selectedCosmosChain && ibcCurrencyOptions && (
              <div className="ml-3">
                <Dropdown
                  placeholder="Select a token"
                  options={ibcCurrencyOptions}
                  defaultOption={defaultIbcCurrencyOption}
                  onSelect={selectIbcCurrency}
                />
              </div>
            )}
          </div>
          {fromAddress && (
            <div className="field-info-box py-2 px-3">
              {fromAddress && (
                <p className="has-text-grey-light has-text-weight-semibold">
                  Address: {fromAddress}
                </p>
              )}
              {fromAddress &&
                selectedIbcCurrency &&
                !isLoadingCosmosBalance && (
                  <p className="mt-2 has-text-grey-lighter has-text-weight-semibold">
                    Balance: {cosmosBalance}
                  </p>
                )}
              {fromAddress && isLoadingCosmosBalance && (
                <p className="mt-2 has-text-grey-lighter has-text-weight-semibold">
                  Balance: <i className="fas fa-spinner fa-pulse" />
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {isAnimating ? (
        <AnimatedArrowSpacer isAnimating={isAnimating} />
      ) : (
        <div className="is-flex is-flex-direction-row">
          <div>
            <span className="icon is-medium">
              <i className="i-arrow-up-arrow-down" />
            </span>
          </div>
          <div className="ml-4 card-spacer" />
        </div>
      )}

      <div className="field">
        <div className="is-flex is-flex-direction-row is-align-items-center">
          <div className="label-left">To</div>
          <div className="is-flex-grow-1">
            <Dropdown
              placeholder="Connect EVM Wallet or enter address"
              options={evmChainsOptions}
              onSelect={selectEvmChain}
              leftIconClass={"i-wallet"}
              additionalOptions={additionalEvmChainOptions}
              valueOverride={selectedEvmChainOption}
            />
          </div>
          {selectedEvmChain && evmCurrencyOptions && (
            <div className="ml-3">
              {/* NOTE - the placeholder happens to only be shown when there isn't a matching */}
              {/* evm currency. It's also always disabled because it's controlled by sender currency selection. */}
              <Dropdown
                placeholder="No matching token"
                options={evmCurrencyOptions}
                defaultOption={defaultEvmCurrencyOption}
                onSelect={selectEvmCurrency}
                valueOverride={selectedEvmCurrencyOption}
                disabled={true}
              />
            </div>
          )}
        </div>
        {evmAccountAddress &&
          !isRecipientAddressEditable &&
          !recipientAddressOverride && (
            <div className="field-info-box mt-3 py-2 px-3">
              {evmAccountAddress && (
                <p
                  className="has-text-grey-light has-text-weight-semibold is-clickable"
                  onKeyDown={handleEditRecipientClick}
                  onClick={handleEditRecipientClick}
                >
                  <span className="mr-2">Address: {evmAccountAddress}</span>
                  <i className="fas fa-pen-to-square" />
                </p>
              )}
              {evmAccountAddress &&
                selectedEvmChain &&
                !isLoadingSelectedEvmCurrencyBalance && (
                  <p className="mt-2 has-text-grey-lighter has-text-weight-semibold">
                    Balance: {selectedEvmCurrencyBalance}
                  </p>
                )}
              {evmAccountAddress && isLoadingSelectedEvmCurrencyBalance && (
                <p className="mt-2 has-text-grey-lighter has-text-weight-semibold">
                  Balance: <i className="fas fa-spinner fa-pulse" />
                </p>
              )}
              {selectedEvmCurrencyOption?.value?.erc20ContractAddress && (
                <AddErc20ToWalletButton
                  evmCurrency={selectedEvmCurrencyOption.value}
                />
              )}
            </div>
          )}
        {recipientAddressOverride && !isRecipientAddressEditable && (
          <div className="field-info-box mt-3 py-2 px-3">
            <p
              className="has-text-grey-light has-text-weight-semibold is-clickable"
              onKeyDown={handleEditRecipientClick}
              onClick={handleEditRecipientClick}
            >
              <span className="mr-2">Address: {recipientAddressOverride}</span>
              <i className="fas fa-pen-to-square" />
            </p>
            {!isRecipientAddressValid && hasTouchedForm && (
              <div className="help is-danger mt-2">
                Recipient address must be a valid EVM address
              </div>
            )}
            <p className="mt-2 has-text-grey-lighter has-text-weight-semibold is-size-7">
              Connect via wallet to show balance
            </p>
          </div>
        )}
        {isRecipientAddressEditable && (
          <div className="field-info-box mt-3 py-2 px-3">
            <div className="has-text-grey-light has-text-weight-semibold">
              <input
                className="input is-medium is-outlined-white"
                type="text"
                placeholder="0x..."
                onChange={updateRecipientAddressOverride}
                value={recipientAddressOverride}
              />
              <button
                type="button"
                className="button is-ghost is-outlined-white mr-2 mt-2"
                onClick={handleEditRecipientSave}
              >
                Save
              </button>
              <button
                type="button"
                className="button is-ghost is-outlined-white mt-2"
                onClick={handleEditRecipientClear}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="is-flex is-flex-direction-row is-align-items-center">
        <div className="card-spacer" />
      </div>

      <div className="field">
        <div className="is-flex is-flex-direction-row is-align-items-center">
          <div className="label-left">Amount</div>
          <div className="control mt-1 is-flex-grow-1">
            <input
              className="input is-medium"
              type="text"
              placeholder="0.00"
              onChange={updateAmount}
              value={amount}
            />
          </div>
        </div>
        {!isAmountValid && hasTouchedForm && (
          <div className="help is-danger mt-2">
            Amount must be a number greater than 0
          </div>
        )}
      </div>

      <div className="card-footer mt-4">
        <button
          type="button"
          className="button is-tall is-wide has-gradient-to-right-orange has-text-weight-bold has-text-white"
          onClick={() => handleDeposit()}
          disabled={isDepositDisabled}
        >
          {isLoading ? "Processing..." : "Deposit"}
        </button>
      </div>
    </div>
  );
}
