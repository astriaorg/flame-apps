import type { IconProps } from "../types";

export const StrideIcon: React.FC<IconProps> = ({
  className = "",
  size = 24,
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="240" height="240" rx="120" fill="#E6007A" />
      <path
        d="M173.186 156.694C160.463 156.694 150.168 146.38 150.168 133.676V99.2072H179.856V79.1581H150.168V46L127.42 58.1451V79.1581H84.276C54.2023 79.1581 46.2983 115.401 69.4319 128.895L92.9511 144.703C98.1561 148.559 96.0355 156.656 88.7099 156.656H56.7084V176.897H88.7099C118.976 176.897 126.688 140.655 103.554 127.16L80.2276 111.352C75.0225 107.497 76.9503 99.2072 84.276 99.2072H127.42V133.946C127.42 160.164 145.541 176.917 172.916 176.917H179.856V156.694H173.186Z"
        fill="white"
      />
    </svg>
  );
};
