"use client";
import { baseURL } from "@/api/baseURL";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export interface ProductType {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
const Home = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [product, setProduct] = useState<ProductType>({
    id: 0,
    name: "",
    price: 0,
    image: "",
    quantity: 0,
  });
  const [isEdit, setIsEdit] = useState(false);
  const resetInput = () =>
    setProduct({
      id: 0,
      name: "",
      price: 0,
      image: "",
      quantity: 0,
    });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEdit) {
      return setProduct((prev) => ({ ...prev, [name]: value }));
    }
    return setProduct((prev) => ({
      ...prev,
      id: products ? products.length + 2 : 0,
      [name]: value,
    }));
  };
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(product);

    const newProduct = { ...product, id: products.length };
    setProducts((prev) => [...prev, newProduct]);
    const response = await baseURL.post("/api/products", { ...product });
    resetInput();
  };
  const edit = (id: number) => {
    setIsEdit(true);
    const product = products.find((item) => item.id === id);
    console.log(product);
    return product ? setProduct(product) : resetInput();
  };
  const handleEdit = async () => {
    if (
      product.name === "" ||
      !product.price ||
      product.image === "" ||
      !product.quantity
    ) {
      return;
    }
    console.log(product.id);

    const updatedProduct = {
      ...product,
      id: product.id,
      quantity: +product.quantity,
      price: +product.price,
    };
    console.log(product.id);

    setProducts((prev) =>
      prev.map((item) => (item.id === product.id ? updatedProduct : item))
    );
    console.log(updatedProduct);
    try {
      const response = await baseURL.put(
        `/api/products/${product.id}`,
        updatedProduct
      );
      if (response.status === 200) {
        setIsEdit(false);
        resetInput();
      } else {
        console.error("Sửa thất bại:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi, không thể sửa:", error);
    }
  };
  const handleDelete = (id: number) => {
    
  }
  useEffect(() => {
    const fecthProduct = async () => {
      try {
        const response = await baseURL.get("/api/products");
        const data = await response.data;
        setProducts(data);
      } catch (error) {
        console.error("Lỗi, không thể lấy dữ liệu sản phẩm", error);
      }
    };
    fecthProduct();
  }, []);
  return (
    <main className="flex gap-[20px]">
      <Table className="border-[1px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">STT</TableHead>
            <TableHead className="w-[100px] text-center">
              Tên sản phẩm
            </TableHead>
            <TableHead className="w-[100px] text-center">Hình ảnh</TableHead>
            <TableHead className="w-[100px] text-center">Giá</TableHead>
            <TableHead className="w-[100px] text-center">Số lượng</TableHead>
            <TableHead className="w-[100px] text-center">Chức năng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: ProductType, index: number) => (
            <TableRow>
              <TableCell className="w-[100px] text-center">
                {index + 1}
              </TableCell>
              <TableCell className="w-[100px] text-center">
                {product.name}
              </TableCell>
              <TableCell className="w-[100px] text-center">
                <img
                  className="w-[100px] h-[60px] rounded-[5px]"
                  src={product.image}
                />
              </TableCell>
              <TableCell className="w-[100px] text-center">
                {product.price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </TableCell>
              <TableCell className="w-[100px] text-center">
                {product.quantity}
              </TableCell>
              <TableCell className="w-[100px] text-center">
                <Button
                  onClick={() => edit(product.id)}
                  className="mr-[10px] hover:bg-[#555]"
                >
                  Sửa
                </Button>
                <Button onClick={() => handleDelete(product.id)} className="hover:bg-[#d00]" variant="destructive">
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <form
        onSubmit={handleAdd}
        className="w-[700px] h-[400px] rounded-[3px] p-[10px] border-[1px] flex flex-col items-center mt-[10px]"
      >
        <h2 className="font-[600] text-[20px]">Thêm mới sản phẩm</h2>
        <div className="w-[90%] mb-[10px]">
          <label className="mb-[5px] block">Tên</label>
          <input
            value={product.name}
            onChange={handleChange}
            name="name"
            className="w-[100%] pl-[10px] h-[25px] rounded-[5px] border-[1px] outline-none"
            type="text"
          />
        </div>
        <div className="w-[90%] mb-[10px]">
          <label className="mb-[5px] block">Hình ảnh</label>
          <input
            value={product.image}
            onChange={handleChange}
            name="image"
            className="w-[100%] pl-[10px] h-[25px] rounded-[5px] border-[1px] outline-none"
            type="text"
          />
        </div>
        <div className="w-[90%] mb-[10px]">
          <label className="mb-[5px] block">Giá</label>
          <input
            value={product.price}
            onChange={handleChange}
            name="price"
            className="w-[100%] pl-[10px] h-[25px] rounded-[5px] border-[1px] outline-none"
            type="number"
            min={1000}
          />
        </div>
        <div className="w-[90%] mb-[10px]">
          <label className="mb-[5px] block">Số lượng</label>
          <input
            value={product.quantity}
            onChange={handleChange}
            name="quantity"
            className="w-[100%] pl-[10px] h-[25px] rounded-[5px] border-[1px] outline-none"
            type="number"
            defaultValue={1}
            min={1}
          />
        </div>
        {isEdit ? (
          <Button
            type="button"
            onClick={handleEdit}
            className="w-[90%] bg-blue-500 hover:bg-[#07f]"
          >
            Sửa
          </Button>
        ) : (
          <Button type="submit" className="w-[90%] bg-blue-500 hover:bg-[#07f]">
            Thêm
          </Button>
        )}
      </form>
    </main>
  );
};

export default Home;
