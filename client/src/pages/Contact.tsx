import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <h1 className="text-4xl font-display font-bold mb-8">Contact Us</h1>
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-sm font-medium">Name</label>
               <Input placeholder="Your name" className="bg-black/20" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Email</label>
               <Input placeholder="Your email" className="bg-black/20" />
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Message</label>
             <Textarea placeholder="How can we help?" className="bg-black/20 min-h-[150px]" />
          </div>
          <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Send Message</Button>
        </form>
      </div>
    </Layout>
  );
}
