import GradientButton from "@/components/ui/button-1";

const DemoOne = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <GradientButton
        onClick={() => console.log("clicked")}
        width="360px"
        height="120px"
        disabled={false}
      >
        Button
      </GradientButton>
    </div>
  );
};

export { DemoOne };
