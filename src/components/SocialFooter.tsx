import { Instagram, Youtube, Facebook } from "lucide-react";

const SocialFooter = () => {
  return (
    <footer className="mt-12 pt-8 border-t border-border">
      <div className="church-card text-center">
        <h3 className="text-lg font-semibold mb-6">Connect With Us</h3>
        <div className="flex gap-6 justify-center items-center">
          <a 
            href="https://www.instagram.com/tacnorthwest/#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a 
            href="https://www.youtube.com/@theapostolicchurchnorthwest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
            aria-label="Subscribe to our YouTube channel"
          >
            <Youtube className="w-6 h-6" />
          </a>
          <a 
            href="https://www.facebook.com/tacnw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
            aria-label="Like us on Facebook"
          >
            <Facebook className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SocialFooter;