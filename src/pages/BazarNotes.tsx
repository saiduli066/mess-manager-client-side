import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, Check, ShoppingCart, Plus, Receipt } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BazarItem {
    id: string;
    name: string;
    quantity: string;
    unit: string;
    estimatedPrice: number;
    actualPrice?: number;
    category: string;
    status: "pending" | "bought";
    date: string;
}

export default function BazarNotes() {
    const [items, setItems] = useState<BazarItem[]>([]);
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("kg");
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [category, setCategory] = useState("vegetables");

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("bazarNotes");
        if (saved) {
            setItems(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem("bazarNotes", JSON.stringify(items));
    }, [items]);

    const addItem = () => {
        if (itemName.trim() && quantity.trim() && estimatedPrice.trim()) {
            const newItem: BazarItem = {
                id: Date.now().toString(),
                name: itemName.trim(),
                quantity: quantity.trim(),
                unit,
                estimatedPrice: parseFloat(estimatedPrice),
                category,
                status: "pending",
                date: new Date().toISOString().split("T")[0],
            };
            setItems([newItem, ...items]);
            setItemName("");
            setQuantity("");
            setEstimatedPrice("");
        }
    };

    const deleteItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const toggleStatus = (id: string) => {
        setItems(
            items.map((item) =>
                item.id === id
                    ? { ...item, status: item.status === "pending" ? "bought" : "pending" }
                    : item
            )
        );
    };

    const updateActualPrice = (id: string, price: string) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, actualPrice: parseFloat(price) || undefined } : item
            )
        );
    };

    const clearCompleted = () => {
        setItems(items.filter((item) => item.status === "pending"));
    };

    const pendingItems = items.filter((item) => item.status === "pending");
    const boughtItems = items.filter((item) => item.status === "bought");
    const totalEstimated = items.reduce((sum, item) => sum + item.estimatedPrice, 0);
    const totalActual = items.reduce((sum, item) => sum + (item.actualPrice || item.estimatedPrice), 0);
    const categories = ["vegetables", "groceries", "dairy", "meat", "spices", "others"];
    const units = ["kg", "g", "L", "ml", "pcs", "dozen", "bunch"];

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 min-h-screen bg-[#0F1729]">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                    <ShoppingCart className="w-8 h-8 text-[#7E22CE]" />
                    Bazar Shopping List
                </h1>
                <p className="text-gray-300 text-sm">
                    Track your mess shopping items, costs, and manage your grocery budget efficiently
                </p>
            </div>

            {/* Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-300">Estimated Total</p>
                        <p className="text-2xl font-bold text-white">৳{totalEstimated.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-300">Actual Total</p>
                        <p className="text-2xl font-bold text-[#7E22CE]">৳{totalActual.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-300">Difference</p>
                        <p className={`text-2xl font-bold ${totalActual - totalEstimated > 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {totalActual - totalEstimated > 0 ? '+' : ''}৳{(totalActual - totalEstimated).toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Add Item Form */}
            <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Plus className="w-5 h-5 text-[#7E22CE]" />
                        Add New Item
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <Label className="text-gray-300">Item Name</Label>
                            <Input
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder="e.g., Potatoes"
                                className="bg-[#0F1729] border-[#7E22CE]/30 text-white"
                                onKeyPress={(e) => e.key === "Enter" && addItem()}
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Quantity</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="10"
                                    className="bg-[#0F1729] border-[#7E22CE]/30 text-white"
                                    onKeyPress={(e) => e.key === "Enter" && addItem()}
                                />
                                <Select value={unit} onValueChange={setUnit}>
                                    <SelectTrigger className="w-24 bg-[#0F1729] border-[#7E22CE]/30 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                        {units.map((u) => (
                                            <SelectItem key={u} value={u} className="text-white focus:bg-[#7E22CE]/20">
                                                {u}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-300">Est. Price (৳)</Label>
                            <Input
                                type="number"
                                value={estimatedPrice}
                                onChange={(e) => setEstimatedPrice(e.target.value)}
                                placeholder="100"
                                className="bg-[#0F1729] border-[#7E22CE]/30 text-white"
                                onKeyPress={(e) => e.key === "Enter" && addItem()}
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-[#0F1729] border-[#7E22CE]/30 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="text-white focus:bg-[#7E22CE]/20">
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 flex items-end">
                            <Button
                                onClick={addItem}
                                className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5]"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to List
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Items */}
            {pendingItems.length > 0 && (
                <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2 text-white">
                                <ShoppingCart className="w-5 h-5 text-[#7E22CE]" />
                                Shopping List ({pendingItems.length} items)
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {pendingItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-4 bg-[#0F1729] border border-[#7E22CE]/20 rounded-lg hover:border-[#7E22CE]/40 transition-all"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleStatus(item.id)}
                                        className="hover:bg-[#7E22CE]/20"
                                    >
                                        <div className="w-5 h-5 rounded border-2 border-[#7E22CE] flex items-center justify-center">
                                            {item.status === "bought" && <Check className="w-4 h-4 text-[#7E22CE]" />}
                                        </div>
                                    </Button>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{item.name}</p>
                                        <p className="text-sm text-gray-400">
                                            {item.quantity} {item.unit} • {item.category} • ৳{item.estimatedPrice}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteItem(item.id)}
                                    className="hover:bg-red-500/20"
                                >
                                    <Trash className="w-4 h-4 text-red-400" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Bought Items */}
            {boughtItems.length > 0 && (
                <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Receipt className="w-5 h-5 text-green-400" />
                                Purchased Items ({boughtItems.length})
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearCompleted}
                                className="border-[#7E22CE]/30 text-gray-300 hover:bg-[#7E22CE]/20"
                            >
                                Clear All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {boughtItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-4 bg-[#0F1729] border border-green-500/20 rounded-lg"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleStatus(item.id)}
                                        className="hover:bg-[#7E22CE]/20"
                                    >
                                        <div className="w-5 h-5 rounded border-2 border-green-500 bg-green-500/20 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                    </Button>
                                    <div className="flex-1">
                                        <p className="font-medium text-white line-through opacity-70">{item.name}</p>
                                        <p className="text-sm text-gray-400">
                                            {item.quantity} {item.unit} • {item.category}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Actual ৳"
                                            value={item.actualPrice || ""}
                                            onChange={(e) => updateActualPrice(item.id, e.target.value)}
                                            className="w-24 bg-[#0F1729] border-[#7E22CE]/30 text-white text-sm"
                                        />
                                        <span className="text-gray-400 text-sm">
                                            (Est: ৳{item.estimatedPrice})
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteItem(item.id)}
                                    className="hover:bg-red-500/20"
                                >
                                    <Trash className="w-4 h-4 text-red-400" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {items.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No items in your shopping list yet</p>
                    <p className="text-sm">Add items above to start planning your mess shopping</p>
                </div>
            )}
        </div>
    );
}

