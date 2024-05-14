import Image from "next/image";
import { db } from "../../_lib/prisma";
import { notFound } from "next/navigation";
import { calculateTotalPrice, formatCurrency } from "@/app/_helpers/price";
import ProductImage from "../_components/product-image";
import { ArrowDownIcon } from "lucide-react";
import DiscountBadge from "@/app/_components/discount-badge";


interface ProductPageProps {
    params: {
        id: string
    }
}

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
    const product = await db.product.findUnique({

        where: {
            id,
        },
        include: {
            restaurant: true,
        },
    });

    if (!product) {

        return notFound();

    };

    return (
        <div>

            <ProductImage product={product} />

            <div className="p-5">

                <div className="flex items-center gap-[0.375rem]">
                    <div className="relative h-6 w-6 ">
                        <Image
                            src={product.restaurant.imageUrl}
                            alt={product.restaurant.name}
                            width={16}
                            height={16}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <span>{product.restaurant.name}</span>
                </div>
                <h1 className="mb-3 mt-1 text-xl font-semibold ">{product.name}</h1>

                <div className="flex justify-between">
                </div>

                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                        {formatCurrency(calculateTotalPrice(product))}
                    </h2>
                    {product.discountPercentage && (<DiscountBadge product={product} />
                    )}
                </div>
                <span className="text-sm text-muted-foreground">
                    {formatCurrency(Number(product.price))}
                </span>
            </div>
        </div>
    );
}

export default ProductPage;