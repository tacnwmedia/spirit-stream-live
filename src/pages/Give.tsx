import { Heart, DollarSign, CreditCard, Smartphone } from "lucide-react";
import Navigation from "@/components/Navigation";

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
              <div className="bg-accent rounded-lg p-4">
                <p className="church-text"><strong>Send to:</strong> offerings@gracefellowship.org</p>
                <p className="church-text"><strong>Account Name:</strong> Grace Fellowship Church</p>
              </div>
              <p className="church-text text-muted-foreground">
                Use your bank's mobile app to send a Zelle payment to the email above.
              </p>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="church-card">
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Bank Transfer</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-accent rounded-lg p-4">
                <p className="church-text"><strong>Account Name:</strong> Grace Fellowship Church</p>
                <p className="church-text"><strong>Routing Number:</strong> 123456789</p>
                <p className="church-text"><strong>Account Number:</strong> 987654321</p>
              </div>
              <p className="church-text text-muted-foreground">
                Use these details for direct bank transfers or ACH payments.
              </p>
            </div>
          </div>

          {/* Mail Offering */}
          <div className="church-card">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Mail Your Offering</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-accent rounded-lg p-4">
                <p className="church-text"><strong>Grace Fellowship Church</strong></p>
                <p className="church-text">123 Church Street</p>
                <p className="church-text">Your City, ST 12345</p>
              </div>
              <p className="church-text text-muted-foreground">
                Make checks payable to "Grace Fellowship Church" and mail to the address above.
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="church-card text-center">
            <h3 className="text-xl font-semibold mb-4">Quick Give QR Code</h3>
            <div className="bg-accent rounded-lg p-8 inline-block">
              <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <span className="text-muted-foreground text-sm">QR Code</span>
              </div>
            </div>
            <p className="church-text text-muted-foreground mt-4">
              Scan to give securely through our online giving platform
            </p>
          </div>
        </div>

        <div className="church-card mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Thank You</h3>
          <p className="church-text text-muted-foreground leading-relaxed">
            Your generous giving helps support our ministry, community outreach, 
            and the ongoing work of God through Grace Fellowship. 
            May God bless your faithful stewardship.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Give;