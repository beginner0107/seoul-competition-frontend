import { motion } from "framer-motion";
import Header from "./Header";
import { useAppSelector } from "@toolkit/hook";
import Alert from "@components/Alert";
import Chat from "@components/Chat";
import ChatButton from "@components/Chat/ChatButton";

export default function OnePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAlert = useAppSelector((state) => state.alert.isAlert);

  return (
    <>
      {/* 해더 영역 */}
      <Header />

      {/* Alert */}
      {isAlert && <Alert />}

      {/* 채팅창 */}
      <Chat />
      <ChatButton />

      {/* 메인 영역 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="col-center container mx-auto h-screen w-screen px-0 pt-20  md:px-4 ">
          {children}
        </div>
      </motion.div>
    </>
  );
}
