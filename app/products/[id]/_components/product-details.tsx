"use client";

import { Prisma } from "@prisma/client";
import Image from "next/image";
import { calculateTotalPrice, formatCurrency } from "@/app/_helpers/price";
import DiscountBadge from "@/app/_components/discount-badge";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import ProductList from "@/app/_components/products-list";
import DeliveryInfo from "@/app/_components/delivery-info";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;

  recommendedProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  recommendedProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () =>
    setQuantity((currentState) => currentState + 1);
  const handleDecreaseQuantity = () =>
    setQuantity((currentState) => {
      if (currentState === 1) return 1;

      return currentState - 1;
    });

  return (
    <div className="relative z-50 mt-[-1.5rem]  rounded-tl-3xl rounded-tr-3xl bg-white py-5">
      <div className="flex items-center gap-[0.375rem] px-5">
        <div className="relative h-6 w-6 ">
          <Image
            src={product.restaurant.imageUrl}
            alt={product.restaurant.name}
            fill
            sizes="100%"
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {product.restaurant.name}
        </span>
      </div>

      <h1 className="mb-2 mt-1 px-5 text-xl font-semibold">{product.name}</h1>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2 px-5">
            <h2 className="text-xl font-semibold">
              {formatCurrency(calculateTotalPrice(product))}
            </h2>
            {product.discountPercentage && <DiscountBadge product={product} />}
          </div>

          {product.discountPercentage > 0 && (
            <p className="px-5 text-sm text-muted-foreground">
              De: {formatCurrency(Number(product.price))}
            </p>
          )}
        </div>

        {/* Preço produto e quantidade */}
        <div className="flex justify-between px-5">
          <div className="flex items-center gap-3 px-5 text-center">
            <Button
              size="icon"
              variant="ghost"
              className="border border-solid border-muted-foreground"
              onClick={handleDecreaseQuantity}
            >
              <ChevronLeftIcon />
            </Button>
            <span className="w-4">{quantity}</span>

            <Button size="icon" onClick={handleIncreaseQuantity}>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5">
        <DeliveryInfo restaurant={product.restaurant} />
      </div>
      <div className="px-5">
        <div className="mt-6 space-y-3">
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold ">Sobre</h3>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Sucos</h3>
            <ProductList products={recommendedProducts} />
          </div>

          <div className="px-5">
            <Button className="mt-6 w-full font-semibold">
              Adicionar à sacola
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
