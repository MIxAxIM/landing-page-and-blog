import { stringToHex } from "@meshsdk/common";


export default function Components() {
  const data = "de06f9ebfa61863766f45b2c61d6d31f851b73bb3fcf92af79ff6081"
  const hash = stringToHex(data)
  return (
    <div>
      <h2>Test Compontents</h2>
      <div className="text-sm p-5 border border-gray-300">
        {hash}
      </div>



    </div>
  );
}



