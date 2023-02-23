import create from 'zustand';
import { Items as Item } from '../shared/interfaces/items';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { persist, createJSONStorage } from 'zustand/middleware';

type PersistedState = {
	Items: Array<Item>;
};

type Store = PersistedState & {
	newItem: Item | {};
	loadCart: (items: Item[]) => void;
	addItem: (newItem: Item) => void;
	updateItem: (id: number, quantity: number) => void;
	removeItem: (id: number) => void;
	showCart: () => Array<Item>;
	clearCart: () => void;
	cartCount: () => number;
	cartTotal: () => number;
	cartIsEmpty: () => boolean;
};

const useShoppingCart = create<Store>()(
	persist(
		(set, get) => ({
			Items: [],
			newItem: {},
			loadCart: (items: Item[]) => set((state) => ({ Items: items })),
			showCart: () => get().Items,
			addItem: (newItem: Item) => {
				const existingItem = get().Items.find(
					(item) => item.item_id === newItem.item_id
				);
				if (existingItem) {
					useShoppingCart
						.getState()
						.updateItem(
							existingItem.item_id!,
							existingItem.quantity + newItem.quantity
						);
				} else {
					set((state) => ({
						Items: [...state.Items, newItem],
					}));
				}
			},
			updateItem: (id: number, quantity: number) => {
				set((state) => {
					const cartItem = state.Items.find(
						(item) => item.item_id === id
					);
					if (cartItem) {
						cartItem.quantity = quantity;
					}
					return {
						...state,
						Items: [...state.Items],
					};
				});
			},
			removeItem: (id: number | string) =>
				set((state) => ({
					Items: state.Items.filter((item) => item.item_id !== id),
				})),
			clearCart: () => set((state) => ({ Items: [] })),
			cartCount: () => {
				return get().Items.length;
			},
			cartTotal: () => {
				return get().Items.reduce(
					(total, item) => total + item.price * item.quantity,
					0
				);
			},
			cartIsEmpty: () => {
				return get().Items.length === 0;
			},
		}),
		{
			name: 'shopping-cart',
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useShoppingCart;

if (import.meta.env.NODE_ENV === 'development') {
	mountStoreDevtool('Store', useShoppingCart);
}
