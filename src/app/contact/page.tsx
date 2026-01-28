import { Content } from "@/ui/components";
import { Showcase } from "@/ui/components/showcase/Showcase";
import placeholder from "@/assets/images/placeholder/placeholder.svg";

export default function Contact() {
  return (
    <Content className="lg:span-gap-1-wider gap-40 mb-64 text-12 leading-near">
      <Showcase i1={placeholder} i2={placeholder} i3={placeholder} />
      <section className="flex justify-between lg-max:flex-col w-full items-end">
        <form className="flex flex-col w-full lg:span-w-4 gap-8">
          <h2 className="text-12 uppercase mb-8">Contact</h2>
          <input
            type="text"
            placeholder="Name"
            className="p-8 bg-white/10 focus:outline-black"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-8 bg-white/10 focus:outline-black"
          />
          <textarea
            placeholder="Message"
            className="focus:outline-black bg-white/10 h-120 p-8"
          />
          <button className="bg-white text-black p-8 uppercase" type="submit">
            Send
          </button>
        </form>
      </section>
    </Content>
  );
}
