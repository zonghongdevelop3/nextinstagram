import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

function Message({ username, message }) {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="p-1 mt-10">
      <div className="relative">
        <div
          className={`absolute ${
            username === user?.displayName ? "right-0 " : "left-0"
          }`}
        >
          <p
            className={`p-2 text-base rounded-3xl font-mono shadow-md  ${
              username === user?.displayName
                ? "bg-green-300 text-left"
                : "bg-pink-300 text-right"
            }`}
          >
            {message.message}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-lg font-medium">{username}</h3>
            <p className="text-gray-400 text-xs">
              {message.timestamp
                ? moment(message.timestamp).format("LT")
                : "..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
