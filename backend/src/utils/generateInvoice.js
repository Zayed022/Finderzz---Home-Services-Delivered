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

      const type =
        service.bookingType === "inspection"
          ? "Inspection"
          : "Service";

      const amount = service.price * service.quantity;

      doc.text(service.subServiceId.name, colX[0], y);
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
      .text(`Service Charges: ₹${booking.subtotal}`, 360, boxY + 35)
      .text(`Area Charges: ₹${booking.extraCharge}`, 360);

    doc
      .fontSize(12)
      .text(`Total Paid: ₹${booking.totalPrice}`, 360, boxY + 70);

    doc.moveDown(5);

    /* ================= TERMS ================= */

    const termsY = boxY + 140;

    doc
      .fontSize(13)
      .text("Terms & Conditions", 50, termsY);

    doc.moveDown();

    doc
      .fontSize(9)
      .text(
`1. Finderzz is a technology marketplace platform connecting customers with independent service professionals.

2. Finderzz does not directly provide services. Services are performed by verified third-party professionals.

3. Inspection fees are non-refundable once the inspection service is completed.

4. Final repair pricing may vary based on on-site diagnosis.

5. Finderzz shall not be liable for damages arising from incorrect information provided by the customer.

6. Any service disputes must be reported within 24 hours through Finderzz support.

7. Finderzz reserves the right to cancel or reschedule services due to operational constraints.

8. Payments made through Finderzz confirm acceptance of platform policies and service agreements.

9. This invoice serves as a digital confirmation of the service request.

10. All disputes shall be governed under applicable Indian law.`
      ,50,termsY+25,{
        width:500,
        align:"left"
      });

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