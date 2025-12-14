import { Heart, DollarSign, CreditCard, Smartphone } from "lucide-react";
import Navigation from "@/components/Navigation";
import SocialFooter from "@/components/SocialFooter";

const Give = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="church-card mb-8">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Give to Grace Fellowship</h1>
          </div>
          <p className="text-center church-text text-muted-foreground">
            "Each of you should give what you have decided in your heart to give, 
            not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* Zelle Payment */}
          <div className="church-card">
            <div className="flex items-center mb-4">
              <Smartphone className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Zelle Payment</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-accent rounded-lg p-6">
                <p className="church-text text-lg"><strong>Send to:</strong> apostolicnw@att.net</p>
                <p className="church-text text-lg"><strong>Account Name:</strong> The Apostolic Church Northwest Suburb SC</p>
              </div>
              <p className="church-text text-muted-foreground">
                Use your bank's mobile app to send a Zelle payment to the email above.
              </p>
            </div>
          </div>
        </div>

        <div className="church-card mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Thank You</h3>
          <p className="church-text text-muted-foreground leading-relaxed mb-6">
            Your generous giving helps support our ministry, community outreach, 
            and the ongoing work of God through Grace Fellowship. 
            May God bless your faithful stewardship.
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto text-sm sm:text-base"
          >
            <span className="hidden xs:inline">Return to Homepage</span>
            <span className="xs:hidden">Home</span>
          </a>
        </div>
        
        <SocialFooter />
      </div>
    </div>
  );
};

export default Give;