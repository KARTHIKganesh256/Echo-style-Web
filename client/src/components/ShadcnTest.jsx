import { Button } from "@/components/ui/button";

const ShadcnTest = () => {
  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <h3 className="font-bold mb-2">🎨 Shadcn/ui Test</h3>
      <div className="space-y-2">
        <Button>Default Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <p className="text-xs text-gray-600 mt-2">✅ Shadcn/ui is working!</p>
    </div>
  );
};

export default ShadcnTest;







