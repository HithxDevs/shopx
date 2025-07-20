import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  return (
    <div className="p-4 flex gap-4">
      <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={item.imageUrl || '/placeholder-product.jpg'}
          alt={item.name}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-end justify-between">
        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.productId)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}