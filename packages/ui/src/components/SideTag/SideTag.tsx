import { UpRightSquareIcon } from "../../icons";

interface SideTagProps {
  label: string;
  url: string;
}

/**
 * SideTag component to render a side tag with an icon and label.
 * @param label
 * @param url
 * @param iconClass
 */
export const SideTag = ({ label, url }: SideTagProps) => {
  return (
    <div className="inline-flex items-center">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition"
      >
        <span className="w-5 h-5 flex items-center justify-center">
          <UpRightSquareIcon />
        </span>
        <span>{label}</span>
      </a>
    </div>
  );
};
