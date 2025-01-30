"use client";

import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Input,
} from "../../shadcn-primitives";
import { useState } from "react";
import {
  CheckMarkIcon,
  ChevronDownIcon,
  CloseIcon,
  SearchIcon,
} from "../../icons";
import { TokenItem } from "../../types";

interface TokenSelectorProps {
  tokens: TokenItem[];
  defaultTitle?: string;
  setSelectedToken: (token: TokenItem) => void;
  selectedToken?: TokenItem | null;
  CustomTokenButton?: (props: {
    selectedToken?: TokenItem | null;
    defaultTitle: string;
  }) => React.ReactElement;
}

export const TokenSelector = ({
  tokens,
  defaultTitle = "Select token",
  selectedToken,
  setSelectedToken,
  CustomTokenButton,
}: TokenSelectorProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectToken = (token: TokenItem) => {
    setOpen(false);
    setSelectedToken(token);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const filteredTokens = tokens.filter(
      (token) =>
        token.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        token.symbol.toLowerCase().includes(e.target.value.toLowerCase()),
    );

    setFilteredTokens(filteredTokens);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {CustomTokenButton ? (
        <CustomTokenButton
          selectedToken={selectedToken}
          defaultTitle="Select token"
        />
      ) : (
        <DialogTrigger>
          <div
            className={`flex items-center bg-radial-dark px-1 rounded-2xl border border-solid border-border`}
          >
            {selectedToken?.Icon && <selectedToken.Icon size={20} />}
            <h2 className="text-lg font-medium mx-2 whitespace-nowrap">
              {selectedToken?.symbol || defaultTitle}
            </h2>
            <ChevronDownIcon size={20} />
          </div>
        </DialogTrigger>
      )}
      <DialogPortal>
        <DialogContent className="bg-radial-dark w-[90%] md:w-[90%] lg:w-[450px] [&>button]:hidden fixed top-[440px] left-[50%] -translate-x-[50%] transition rounded-xl">
          <div className="flex items-center justify-between">
            <DialogTitle>Select a token</DialogTitle>
            <button onClick={() => setOpen(false)}>
              <CloseIcon className="text-grey-light hover:text-white transition" />
            </button>
          </div>
          <Input
            placeholder="Search"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full border border-border focus:border-orange-soft rounded-xl"
            startAdornment={<SearchIcon size={16} />}
          />
          <div className="h-[380px]">
            {filteredTokens.map(({ symbol, title, Icon }) => (
              <div
                onClick={() => handleSelectToken({ symbol, title, Icon })}
                key={symbol}
                className={`flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-semi-white transition cursor-pointer ${selectedToken?.symbol === symbol ? "bg-semi-white" : ""}`}
              >
                <div className="flex items-center">
                  <Icon size={32} className="mr-3" />
                  <div className="flex flex-col">
                    <span className="text-white text-md font-semibold">
                      {title}
                    </span>
                    <span className="text-grey-light text-sm">{symbol}</span>
                  </div>
                </div>
                {selectedToken?.symbol === symbol && (
                  <CheckMarkIcon className="text-orange-soft" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
