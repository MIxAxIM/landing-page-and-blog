import Footer from "~/ui/landing/Footer";
import MenuBar from "~/ui/landing/MenuBar";
import { Pricing } from "~/ui/landing/Pricing";


export default function PricingPage() {


  return (
    <>
      <MenuBar />
      <main
        className="items-center justify-center"
        style={{ minHeight: "calc(100vh - 5rem)" }}
      >
        <Pricing />
      </main>
      <Footer />
    </>
  )
}





