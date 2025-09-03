"use client";

import { useCallback, useState } from "react";
import ResetPassword from "./reset";
import SendCode from "./sendcode";
import VerifyCode from "./verifycode";

export type TabForgotPassordType = "sendcode" | "verifycode" | "reset";

export default function TabForgotPassword() {
  const [step, setStep] = useState<TabForgotPassordType>("sendcode");

  const onChangeStep = useCallback((step: TabForgotPassordType) => {
    setStep(step);
  }, []);

  const title = {
    sendcode: "Digite seu email para enviarmos um código de verificação",
    verifycode: "Digite o código enviado para seu email",
    reset: "Digite sua nova senha",
  };

  const currentStep = () => {
    switch (step) {
      case "sendcode":
        return <SendCode onChangeStep={onChangeStep} />;
      case "verifycode":
        return <VerifyCode onChangeStep={onChangeStep} />;
      case "reset":
        return <ResetPassword />;
      default:
        return null;
    }
  };

  return (
    <>
      <p className="text-neutral-200 text-left text-sm sm:text-base mb-6">
        {title[step]}
      </p>
      {currentStep()}
    </>
  );
}
