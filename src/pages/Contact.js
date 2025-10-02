function Contact() {
  return (
    <section className="section">
      <h2>Contact Us</h2>
      <p>Get in touch with the VenSport U-13 League organizers.</p>
      
      <div className="contact-container">
        <div className="contact-info">
          <h3>League Office</h3>
          <div className="contact-item">
            <strong>Address:</strong>
            <p>123 Sports Complex<br/>VenSport City, VC 12345</p>
          </div>
          <div className="contact-item">
            <strong>Phone:</strong>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="contact-item">
            <strong>Email:</strong>
            <p>info@vensport-u13.com</p>
          </div>
          <div className="contact-item">
            <strong>Office Hours:</strong>
            <p>Monday - Friday: 9:00 AM - 5:00 PM<br/>Saturday: 9:00 AM - 2:00 PM</p>
          </div>
        </div>
        
        <form className="contact-form">
          <h3>Send us a Message</h3>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="Subject" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;