import { Heart, Users, MapPin, Phone, Mail, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import SocialFooter from "@/components/SocialFooter";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="church-card mb-8">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">About The Apostolic Church North West</h1>
          </div>
          <p className="text-center church-text text-muted-foreground leading-relaxed">
            A loving community united in faith, hope, and service to God and each other
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* Mission Statement */}
          <div className="church-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-6 h-6 text-primary mr-2" />
              Our Mission
            </h3>
            <p className="church-text text-muted-foreground leading-relaxed">
              At The Apostolic Church North West, we are committed to loving God, loving people, and sharing the 
              Good News of Jesus Christ. We strive to create a welcoming environment where all 
              can experience God's grace, grow in faith, and serve others with compassion.
            </p>
          </div>

          {/* Service Times */}
          <div className="church-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="w-6 h-6 text-primary mr-2" />
              Service Times
            </h3>
            <div className="space-y-3">
              <div className="bg-accent rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2">Sunday Worship</h4>
                <p className="church-text text-muted-foreground">1:00 PM</p>
              </div>
              <div className="bg-accent rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2">Bible Study / Prayer Meeting</h4>
                <p className="church-text text-muted-foreground">Wednesdays – 7:00 PM</p>
              </div>
              <div className="bg-accent rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2">Early Morning Prayer</h4>
                <p className="church-text text-muted-foreground">Tuesdays – 6:00 AM</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="church-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Phone className="w-6 h-6 text-primary mr-2" />
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <div>
                  <p className="church-text font-medium">1 American Way</p>
                  <p className="church-text text-muted-foreground">Elgin, IL 60120</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <p className="church-text">312-667-4792</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <p className="church-text">tacnwmedia@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Pastor's Message */}
          <div className="church-card">
            <h3 className="text-xl font-semibold mb-4">Pastor's Welcome</h3>
            <div className="space-y-4">
              <p className="church-text text-muted-foreground leading-relaxed">
                "Welcome to The Apostolic Church North West! Whether you're a longtime member or visiting 
                for the first time, we're so glad you're here. Our church family is 
                committed to walking together in faith, supporting one another in love, 
                and serving our community with the heart of Christ."
              </p>
              <p className="church-text text-muted-foreground leading-relaxed">
                "We believe that everyone has a place in God's family, and we would be 
                honored to help you discover yours. Come as you are, and let's grow 
                together in grace."
              </p>
              <p className="church-text font-medium">
                Blessings,<br />
                Pastor Joshua Aregbeshola
              </p>
            </div>
          </div>

          {/* What to Expect */}
          <div className="church-card">
            <h3 className="text-xl font-semibold mb-4">What to Expect</h3>
            <div className="space-y-3">
              <div className="bg-accent rounded-lg p-4">
                <h4 className="font-semibold mb-2">Friendly Atmosphere</h4>
                <p className="church-text text-muted-foreground">
                  You'll be warmly welcomed by our greeters and congregation members.
                </p>
              </div>
              <div className="bg-accent rounded-lg p-4">
                <h4 className="font-semibold mb-2">Meaningful Worship</h4>
                <p className="church-text text-muted-foreground">
                  Our services include traditional hymns, prayer, and biblical preaching.
                </p>
              </div>
              <div className="bg-accent rounded-lg p-4">
                <h4 className="font-semibold mb-2">Community Fellowship</h4>
                <p className="church-text text-muted-foreground">
                  Stay after service for coffee and fellowship in our gathering area.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <SocialFooter />
      </div>
    </div>
  );
};

export default About;