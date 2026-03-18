import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = async (booking) => {

  const invoicesDir = path.join(process.cwd(), "uploads", "invoices");

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const fileName = `invoice-${booking._id}.pdf`;
  const filePath = path.join(invoicesDir, fileName);

  const logoPath = path.join(process.cwd(), "public", "logo.jpeg");

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    /* ================= HEADER ================= */

    doc.rect(0,0,600,80).fill("#0A84FF");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 20, { width: 45 });
    }

    doc
      .fillColor("#FFFFFF")
      .fontSize(22)
      .text("Finderzz", 110, 28);

    doc
      .fontSize(10)
      .text("Home Services Marketplace", 110, 52);

    doc
      .fontSize(16)
      .text("INVOICE", 450, 35);

    doc.moveDown(3);
    doc.fillColor("#000000");

    /* ================= INVOICE INFO ================= */

    doc.fontSize(11);

    doc.text(`Invoice Date: ${new Date().toDateString()}`, 50, 110);
    doc.text(`Booking ID: ${booking._id}`);

    doc.moveDown();

    /* ================= CUSTOMER + ADDRESS ================= */

    const leftX = 50;
    const rightX = 300;
    const startY = doc.y + 10;

    doc
      .fontSize(13)
      .text("Customer Details", leftX, startY);

    doc
      .fontSize(10)
      .text(`Name: ${booking.customerDetails.name}`, leftX, startY + 20)
      .text(`Phone: ${booking.customerDetails.phone}`, leftX);

    doc
      .fontSize(13)
      .text("Service Address", rightX, startY);

    let addressY = startY + 20;

    doc
      .fontSize(10)
      .text(booking.address.houseNumber, rightX, addressY);

    if (booking.address.floorNumber)
      doc.text(`Floor: ${booking.address.floorNumber}`, rightX);

    if (booking.address.buildingName)
      doc.text(booking.address.buildingName, rightX);

    if (booking.address.landmark)
      doc.text(`Landmark: ${booking.address.landmark}`, rightX);

    doc.text(booking.address.fullAddress, rightX);

    doc.moveDown(4);

    /* ================= SERVICES TABLE ================= */

    const tableTop = doc.y;

    doc
      .fontSize(13)
      .text("Services", 50, tableTop);

    doc.moveDown();

    const headers = ["Service", "Type", "Qty", "Amount"];

    const colX = [50, 320, 420, 480];

    headers.forEach((header, i) => {
      doc
        .fontSize(10)
        .text(header, colX[i], tableTop + 25);
    });

    doc
      .moveTo(50, tableTop + 40)
      .lineTo(550, tableTop + 40)
      .stroke();

    let y = tableTop + 55;

    booking.services.forEach(service => {

      const isInspection = service.bookingType === "inspection";
    
      const name = isInspection
        ? service.serviceId?.name || "Inspection"
        : service.subServiceId?.name || "Service";
    
      const type = isInspection ? "Inspection" : "Service";
    
      const amount = service.price * service.quantity;
    
      doc.text(name, colX[0], y);
      doc.text(type, colX[1], y);
      doc.text(service.quantity, colX[2], y);
      doc.text(`₹${amount}`, colX[3], y);
    
      y += 25;
    
    });

    doc.moveDown(3);

    /* ================= PAYMENT BOX ================= */

    const boxY = y + 20;

    doc
      .roundedRect(350, boxY, 200, 100, 6)
      .stroke();

    doc
      .fontSize(12)
      .text("Payment Summary", 360, boxY + 10);

      doc
      .fontSize(10)
      .text(`Service Charges: ₹${booking.subtotal}`, 360, boxY + 35);
    
    doc
      .text(`Area Charges: ₹${booking.extraCharge}`, 360, boxY + 50);

      doc
      .fontSize(12)
      .text(`Total Paid: ₹${booking.totalPrice}`, 360, boxY + 70);

    doc.moveDown(5);

    /* ================= TERMS ================= */

    let termsY = boxY + 140;

/* 🔥 PAGE BREAK FIX */
if (termsY > 700) {
  doc.addPage();
  termsY = 50;
}

doc
  .fontSize(13)
  .text("Terms & Conditions", 50, termsY);

termsY += 20;

doc
  .fontSize(9)
  .text(
`1. Finderzz is a technology marketplace platform connecting customers with independent service professionals.

2. Finderzz does not directly provide services and all services are executed by verified third-party professionals.

3. Inspection fees are strictly non-refundable once the inspection service has been completed.

4. Final service pricing may vary based on on-site inspection, complexity, and material requirements.

5. Finderzz is not liable for any damages, delays, or issues caused due to incorrect or incomplete information provided by the customer.

6. All service-related complaints must be reported within 24 hours of service completion via Finderzz support.

7. Finderzz reserves the right to cancel, delay, or reschedule services due to operational or unforeseen circumstances.

8. Payments made through Finderzz confirm acceptance of all platform policies and service agreements.

9. This invoice acts as a digital confirmation of the service request and agreement.

10. A minimum of 50% of the total service cost must be paid in advance before the service begins.

11. The remaining 50% payment must be completed within 24 hours prior to service completion.

12. Failure to complete payments on time may result in service cancellation.

13. Booking a service constitutes a legally binding agreement.

14. Customers agree to revised quotation after inspection.

15. No negotiation outside Finderzz platform.

16. Refunds are subject to approval and deductions.

17. All payments act as proof of agreement.

18. This invoice is a legally binding digital agreement.

19. Finderzz may take legal action in case of fraud.

20. Cancellation >24h may get partial refund.

21. Cancellation <24h may incur charges.

22. Post-dispatch cancellation = full inspection charge.

23. No-show will incur penalty.

24. No refund after service start.

25. One-time rescheduling allowed.

26. Late rescheduling may incur charges.

27. Disputes governed by Indian law.

28. Finderzz acts as facilitator only.
`,
    50,
    termsY,
    {
      width: 500,
      align: "left",
    }
  );

    doc.moveDown(3);

    /* ================= FOOTER ================= */

    doc
      .fontSize(10)
      .text(
        "Thank you for choosing Finderzz",
        { align: "center" }
      );

    doc
      .fontSize(8)
      .text(
        "Finderzz • Home Services Marketplace",
        { align: "center" }
      );

    doc.end();

    stream.on("finish", () => {
      resolve(`/uploads/invoices/${fileName}`);
    });

    stream.on("error", reject);

  });

};