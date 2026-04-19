import { PageView } from "../../components/PageView";
import { productsPageConfig } from "./ProductsPage";

export function ProductsPageView() {
  return (
    <>
      <PageView config={productsPageConfig} />
    </>
  );
}
