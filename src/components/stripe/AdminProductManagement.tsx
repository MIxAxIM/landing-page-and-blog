import ProductForm from "./ProductForm"
import CreatePriceForm from "./PriceForm"

function AddProductForm() {
  return (<div className="border-t border-gray-300 mt-10 py-10"><ProductForm /></div>)
}

function AddPriceForm() {
  return (<div className="border-t border-gray-300 mt-10 py-10"><CreatePriceForm /></div>)
}

function ProductList() {
  return (<div>Product List: see database + stripe console</div>)
}

function PriceList() {
  return (<div>Price List: see database + stripe console</div>)
}

export { AddPriceForm, AddProductForm, ProductList, PriceList }
