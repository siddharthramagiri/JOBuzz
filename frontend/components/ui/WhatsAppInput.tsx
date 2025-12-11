import { IoSend } from "react-icons/io5";
import { FaRegSmile } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { FaCamera } from "react-icons/fa";

export default function WhatsappInput() {
  return (
    <div className="flex items-center gap-2">

      <div className="relative flex-1">

        <FaRegSmile
          size={22}
          className="absolute left-3 top-2.5 text-gray-400"
        />

        <MdAttachFile
          size={22}
          className="absolute right-12 top-2.5 rotate-45 text-gray-400"
        />

        <FaCamera
          size={20}
          className="absolute right-4 top-2.5 text-gray-400"
        />

        <textarea
          rows={1}
          placeholder="Type a message"
          className="w-full bg-zinc-800 rounded-3xl py-2.5 pl-11 pr-12 text-[15px] resize-none outline-none placeholder:text-gray-400"
        />
      </div>

      <button className="p-2 mb-2 bg-[#008069] rounded-full text-white hover:bg-[#01745f]">
        <IoSend size={20} />
      </button>
    </div>
  );
}
