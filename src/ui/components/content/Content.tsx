import { cx } from "@/utils/cx";

export const Content = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <section className={cx("px-16 lg:px-24 w-full flex flex-wrap", className)}>
      {children}
    </section>
  );
};
