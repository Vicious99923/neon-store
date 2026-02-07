import { Layout } from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-display font-bold mb-8">About Neon Drop</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-xl text-muted-foreground leading-relaxed">
            Neon Drop is a futuristic dropshipping platform designed for the next generation of commerce. 
            We connect you with high-quality tech and lifestyle products from around the globe, delivered with speed and style.
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed mt-4">
            Our mission is to create a seamless shopping experience that feels like it's from 2077.
          </p>
        </div>
      </div>
    </Layout>
  );
}
