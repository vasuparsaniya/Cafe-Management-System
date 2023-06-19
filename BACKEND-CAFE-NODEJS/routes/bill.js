const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');
const nodemailer = require('nodemailer');


const PDFDocument = require('pdfkit');


//========================------------------==================

// //----------------------generate report API-------------------------
// router.post('/generateReport', (req, res) => {
//     const generatedUuid = uuid.v1();
//     const orderDetails = req.body;
//     var productDetailsReport = JSON.parse(orderDetails.productDetails);

//     var query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
//     connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
//         if (!err) {
//             const templatePath = path.join(__dirname, '', 'report.ejs');

//             // ejs.renderFile(templatePath, { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, renderedHtml) => {
//             //     if (err) {
//             //         return res.status(500).json(err);
//             //     } else {

//                     const doc = new PDFDocument();

//                     doc.on('error', (err) => {
//                         console.error('PDF generation error:', err);
//                         return res.status(500).json({ error: 'PDF generation error:' });
//                       });

//                     doc.pipe(fs.createWriteStream('./generated_pdf/' + generatedUuid + '.pdf'));

//                     doc.fontSize(24).text('Order Details', { underline: true });
//                     doc.fontSize(16).text(`Name: ${orderDetails.name}`);
//                     doc.fontSize(16).text(`Email: ${orderDetails.email}`);
//                     doc.fontSize(16).text(`Contact Number: ${orderDetails.contactNumber}`);
//                     doc.fontSize(16).text(`Payment Method: ${orderDetails.paymentMethod}`);
//                     doc.fontSize(16).text(`Total Amount: ${orderDetails.totalAmount}`);

//                     //---------------------------
//                     // ...

//                     // Add the product details from the order in an HTML table
//                     doc.moveDown();
//                     doc.fontSize(16).text('Product Details', { underline: true });
//                     doc.moveDown();

//                     const tableHeaders = ['ID', 'Name', 'Price', 'Total', 'Category', 'Quantity'];
//                     const tableData = productDetailsReport.map(product => [
//                         product.id.toString(),
//                         product.name,
//                         product.price.toString(),
//                         product.total.toString(),
//                         product.category,
//                         product.quantity.toString()
//                     ]);

//                     const tableWidths = [60, 120, 60, 60, 80, 80];
//                     const tableSpacing = 10;

//                     // Calculate the width of each column
//                     const availableWidth = doc.page.width - (doc.page.margins.left + doc.page.margins.right);
//                     const columnWidth = availableWidth / tableHeaders.length;

//                     // Set the font size and style for the table
//                     doc.fontSize(12).font('Helvetica');

//                     // Draw the table headers
//                     tableHeaders.forEach((header, index) => {
//                         doc.text(header, doc.page.margins.left + (index * columnWidth), doc.y);
//                     });

//                     doc.moveDown();

//                     // Draw the table rows
//                     tableData.forEach((row, rowIndex) => {
//                         row.forEach((cell, columnIndex) => {
//                             doc.text(cell, doc.page.margins.left + (columnIndex * columnWidth), doc.y);
//                         });

//                         // Move to the next row
//                         doc.moveDown();
//                     });

//                     // Calculate the table height
//                     const tableHeight = (tableData.length + 1) * (doc.currentLineHeight() + tableSpacing);

//                     // Move down by the table height
//                     doc.moveDown(tableHeight);

//                     // ...

//                     //---------------------------

//                     doc.end();

//                     return res.status(200).json({ uuid: generatedUuid });
//                 // }
//             // });
//         } else {
//             return res.status(500).json(err);
//         }
//     });
// });


router.post('/generateReport', auth.authenticateToken, (req, res) => {
  const generatedUuid = uuid.v1();
  const orderDetails = req.body;
  const productDetailsReport = JSON.parse(orderDetails.productDetails);

  const query = "INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    else{
            return res.status(200).json({ uuid: generatedUuid });

    }

    // const doc = new PDFDocument();

    // doc.on('error', (err) => {
    //   console.error('PDF generation error:', err);
    //   return res.status(500).json({ error: 'PDF generation error' });
    // });

    // const pdfPath = path.join(__dirname, 'generated_pdf', `${generatedUuid}.pdf`);
    // const stream = fs.createWriteStream(pdfPath);
    // doc.pipe(stream);

    // doc.fontSize(24).text('Order Details', { underline: true });
    // doc.fontSize(16).text(`Name: ${orderDetails.name}`);
    // doc.fontSize(16).text(`Email: ${orderDetails.email}`);
    // doc.fontSize(16).text(`Contact Number: ${orderDetails.contactNumber}`);
    // doc.fontSize(16).text(`Payment Method: ${orderDetails.paymentMethod}`);
    // doc.fontSize(16).text(`Total Amount: ${orderDetails.totalAmount}`);

    // //---------------------------
    // // ...

    // // Add the product details from the order in an HTML table
    // doc.moveDown();
    // doc.fontSize(16).text('Product Details', { underline: true });
    // doc.moveDown();

    // const tableHeaders = ['ID', 'Name', 'Price', 'Total', 'Category', 'Quantity'];
    // const tableData = productDetailsReport.map(product => [
    //   product.id.toString(),
    //   product.name,
    //   product.price.toString(),
    //   product.total.toString(),
    //   product.category,
    //   product.quantity.toString()
    // ]);

    // const tableWidths = [60, 120, 60, 60, 80, 80];
    // const tableSpacing = 10;

    // // Calculate the width of each column
    // const availableWidth = doc.page.width - (doc.page.margins.left + doc.page.margins.right);
    // const columnWidth = availableWidth / tableHeaders.length;

    // // Set the font size and style for the table
    // doc.fontSize(12).font('Helvetica');

    // // Draw the table headers
    // tableHeaders.forEach((header, index) => {
    //   doc.text(header, doc.page.margins.left + (index * columnWidth), doc.y);
    // });

    // doc.moveDown();

    // // Draw the table rows
    // tableData.forEach((row, rowIndex) => {
    //   row.forEach((cell, columnIndex) => {
    //     doc.text(cell, doc.page.margins.left + (columnIndex * columnWidth), doc.y);
    //   });

    //   // Move to the next row
    //   doc.moveDown();
    // });

    // // Calculate the table height
    // const tableHeight = (tableData.length + 1) * (doc.currentLineHeight() + tableSpacing);

    // // Move down by the table height
    // doc.moveDown(tableHeight);

    // // ...

    // //---------------------------

    // doc.end();

    // stream.on('finish', () => {
    //   return res.status(200).json({ uuid: generatedUuid });
    // });

    // stream.on('error', (err) => {
    //   console.error('PDF stream error:', err);
    //   return res.status(500).json({ error: 'PDF stream error' });
    // });
  });
});

//---------------------Send the uuid and get the pdf if pdf not exist then create and return API-------------------------
router.post('/getPdf', function (req, res) {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';

    if (fs.existsSync(pdfPath)) {

        // Send the email with the PDF attachment
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.google.email',
            // host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL, // Your email address
                pass: process.env.PASSWORD // Your email password or application-specific password
            }
        });


        const mailOptions = {
            from: process.env.EMAIL, // Sender email address
            to: orderDetails.email, // Recipient email address
            subject: 'Cafe Management System - Bill',
            text: 'Please find the attached bill for your order.',
            attachments: [
                {
                    filename: orderDetails.uuid + '.pdf',
                    path: pdfPath
                }
            ]
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Bill Cannot to Email' });
            } else {
                console.log('Email sent:', info.response);
                console.log(orderDetails.email);
                console.log(process.env.EMAIL);
                console.log(process.env.PASSWORD);
                console.log(pdfPath);
                // res.json({ success: true, message: 'PDF sent successfully' });
                return res.status(200).json({ message: 'PDF sent successfully to Email' });

            }
        });
        // return res.status(200).json({ message: 'PDF sent successfully to Email' });
    } else {
        const templatePath = path.join(__dirname, '', 'report.ejs');

        var productDetailsReport = JSON.parse(orderDetails.productDetails);

        ejs.renderFile(templatePath, { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, renderedHtml) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                const doc = new PDFDocument();
                doc.pipe(fs.createWriteStream(pdfPath));

                doc.fontSize(24).text('Order Details', { underline: true });
                doc.fontSize(16).text(`Name: ${orderDetails.name}`);
                doc.fontSize(16).text(`Email: ${orderDetails.email}`);
                doc.fontSize(16).text(`Contact Number: ${orderDetails.contactNumber}`);
                doc.fontSize(16).text(`Payment Method: ${orderDetails.paymentMethod}`);
                doc.fontSize(16).text(`Total Amount: ${orderDetails.totalAmount}`);


                //---------------------------
                // ...

                // Add the product details from the order in an HTML table
                doc.moveDown();
                doc.fontSize(16).text('Product Details', { underline: true });
                doc.moveDown();

                const tableHeaders = ['Name', 'Price', 'Total', 'Category', 'Quantity'];
                const tableData = productDetailsReport.map(product => [
                    product.name,
                    product.price.toString(),
                    product.total.toString(),
                    product.category,
                    product.quantity.toString()
                ]);

                const tableWidths = [60, 120, 60, 60, 80, 80];
                const tableSpacing = 10;

                // Calculate the width of each column
                const availableWidth = doc.page.width - (doc.page.margins.left + doc.page.margins.right);
                const columnWidth = availableWidth / tableHeaders.length;

                // Set the font size and style for the table
                doc.fontSize(12).font('Helvetica');

                // Draw the table headers
                tableHeaders.forEach((header, index) => {
                    doc.text(header, doc.page.margins.left + (index * columnWidth), doc.y);
                });

                doc.moveDown();

                // Draw the table rows
                tableData.forEach((row, rowIndex) => {
                    row.forEach((cell, columnIndex) => {
                        doc.text(cell, doc.page.margins.left + (columnIndex * columnWidth), doc.y);
                    });

                    // Move to the next row
                    doc.moveDown();
                });

                // Calculate the table height
                const tableHeight = (tableData.length + 1) * (doc.currentLineHeight() + tableSpacing);

                // Move down by the table height
                doc.moveDown(tableHeight);

                // ...

                //---------------------------


                doc.end();


                // Send the email with the PDF attachment
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.google.email',
                    // host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL, // Your email address
                        pass: process.env.PASSWORD // Your email password or application-specific password
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL, // Sender email address
                    to: orderDetails.email, // Recipient email address
                    subject: 'Cafe Management System - Bill',
                    text: 'Please find the attached bill for your order.',
                    attachments: [
                        {
                            filename: orderDetails.uuid + '.pdf',
                            path: pdfPath
                        }
                    ]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ error: 'Bill Cannot to Email' });
                    } else {
                        console.log('Email sent:', info.response);
                        // res.json({ success: true, message: 'PDF generated and email sent successfully' });
                        return res.status(200).json({ message: 'PDF sent successfully to Email' });

                    }
                });
                // return res.status(200).json({ message: 'PDF sent successfully to Email' });
            }
        });
    }
});

//=========================-----------------=======================

//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,================================================================


// //----------------------generate report API-------------------------
// router.post('/generateReport', (req, res) => {
//   const generatedUuid = uuid.v1();  //Generate a UUID based on the current time and the MAC address of the Machine
//   const orderDetails = req.body;
//   var productDetailsReport = JSON.parse(orderDetails.productDetails);

//   var query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
//   connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
//     if (!err) {
//       const doc = new PDFDocument();
//       doc.pipe(fs.createWriteStream('./generated_pdf/' + generatedUuid + '.pdf'));

//       doc.fontSize(24).text('Order Details', { underline: true });
//       // Add your content to the PDF using doc.text, doc.image, doc.table, etc.

//       doc.end();

//       return res.status(200).json({ uuid: generatedUuid });
//     } else {
//       return res.status(500).json(err);
//     }
//   });
// });

// //---------------------Send the uuid and get the pdf if pdf not exist then create and return API-------------------------
// router.post('/getPdf', function (req, res) {
//   const orderDetails = req.body;
//   const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';

//   if (fs.existsSync(pdfPath)) {
//     // Send the email with the PDF attachment
//     // Your email sending logic

//      // Send the email with the PDF attachment
//      const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         host: 'smtp.google.email',
//         // host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL, // Your email address
//             pass: process.env.PASSWORD // Your email password or application-specific password
//         }
//     });


//     const mailOptions = {
//         from: process.env.EMAIL, // Sender email address
//         to: orderDetails.email, // Recipient email address
//         subject: 'Cafe Management System - Bill',
//         text: 'Please find the attached bill for your order.',
//         attachments: [
//             {
//                 filename: orderDetails.uuid + '.pdf',
//                 path: pdfPath
//             }
//         ]
//     };


//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//             return res.status(500).json({ error: 'Bill Cannot to Email' });
//         } else {
//             console.log('Email sent:', info.response);
//             console.log(orderDetails.email);
//             console.log(process.env.EMAIL);
//             console.log(process.env.PASSWORD);
//             console.log(pdfPath);
//             // res.json({ success: true, message: 'PDF sent successfully' });
//             return res.status(200).json({ message: 'PDF sent successfully to Email' });

//         }
//     });
//     // return res.status(200).json({ message: 'PDF sent successfully to Email' });
//   } else {
//     const doc = new PDFDocument();

//     var productDetailsReport = JSON.parse(orderDetails.productDetails);
//     doc.pipe(fs.createWriteStream(pdfPath));

//     doc.fontSize(24).text('Order Details', { underline: true });
//     // Add your content to the PDF using doc.text, doc.image, doc.table, etc.

//     doc.end();

//     // Send the email with the PDF attachment
//     // Your email sending logic
//     // Send the email with the PDF attachment
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         host: 'smtp.google.email',
//         // host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL, // Your email address
//             pass: process.env.PASSWORD // Your email password or application-specific password
//         }
//     });

//     const mailOptions = {
//         from: process.env.EMAIL, // Sender email address
//         to: orderDetails.email, // Recipient email address
//         subject: 'Cafe Management System - Bill',
//         text: 'Please find the attached bill for your order.',
//         attachments: [
//             {
//                 filename: orderDetails.uuid + '.pdf',
//                 path: pdfPath
//             }
//         ]
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//             return res.status(500).json({ error: 'Bill Cannot to Email' });
//         } else {
//             console.log('Email sent:', info.response);
//             // res.json({ success: true, message: 'PDF generated and email sent successfully' });
//             return res.status(200).json({ message: 'PDF sent successfully to Email' });

//         }
//     });


//     // return res.status(200).json({ message: 'PDF sent successfully to Email' });
//   }
// });

//,,,,,,,,,,===============================================================================================================

// //----------------------generate report API-------------------------
// router.post('/generateReport', auth.authenticateToken, (req, res) => {
//     const generatedUuid = uuid.v1();  //Generate a UUID based on the current time and the MAC address of the Machine
//     const orderDetails = req.body;
//     var productDetailsReport = JSON.parse(orderDetails.productDetails);  //JSON.parse() it is convert JSON formate to javascript object

//     //    "productDetails":"[{\"id\":1, \"name\": \"Black Coffee\", \"price\": 99, \"total\": 99, \"category\": \"Coffee\", \"quantity\": \"1\"}]"


//     var query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
//     connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
//         if (!err) {
//             // in the {} we write all the variable value that is used in the report.ejs file
//             ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
//                 if (err) {
//                     return res.status(500).json(err);
//                 }
//                 else {
//                     pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, results) {
//                         if (err) {
//                             console.log(err);
//                             return res.status(500).json(err);
//                         }
//                         else {
//                             return res.status(200).json({ uuid: generatedUuid });
//                         }
//                     })
//                 }
//             })
//         }
//         else {
//             return res.status(500).json(err);
//         }
//     })
// })


// //---------------------Send the uuid and get the pdf if pdf not exist the create and return API-------------------------
// router.post('/getPdf', auth.authenticateToken, function (req, res) {
//     const orderDetails = req.body;
//     const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
//     // const outputPath = path.join(__dirname, './generated_pdf/', orderDetails.uuid + '.pdf');


//     if (fs.existsSync(pdfPath)) {
//         // Send the email with the PDF attachment
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             host: 'smtp.google.email',
//             // host: 'smtp.ethereal.email',
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.EMAIL, // Your email address
//                 pass: process.env.PASSWORD // Your email password or application-specific password
//             }
//         });


//         const mailOptions = {
//             from: process.env.EMAIL, // Sender email address
//             to: orderDetails.email, // Recipient email address
//             subject: 'Cafe Management System - Bill',
//             text: 'Please find the attached bill for your order.',
//             attachments: [
//                 {
//                     filename: orderDetails.uuid + '.pdf',
//                     path: pdfPath
//                 }
//             ]
//         };


//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log(error);
//                 return res.status(500).json({ error: 'Bill Cannot to Email' });
//             } else {
//                 console.log('Email sent:', info.response);
//                 console.log(orderDetails.email);
//                 console.log(process.env.EMAIL);
//                 console.log(process.env.PASSWORD);
//                 console.log(pdfPath);
//                 // res.json({ success: true, message: 'PDF sent successfully' });
//                 return res.status(200).json({ message: 'PDF sent successfully to Email' });

//             }
//         });
//     } else {
//         // Generate the PDF
//         var productDetailsReport = JSON.parse(orderDetails.productDetails);
//         ejs.renderFile(path.join(__dirname, '', 'report.ejs'), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
//             if (err) {
//                 return res.status(500).json(err);
//             } else {
//                 pdf.create(results).toFile(pdfPath, function (err, results) {
//                     if (err) {
//                         console.log(err);
//                         return res.status(500).json(err);
//                     } else {
//                         // Send the email with the PDF attachment
//                         const transporter = nodemailer.createTransport({
//                             service: 'gmail',
//                             host: 'smtp.google.email',
//                             // host: 'smtp.ethereal.email',
//                             port: 587,
//                             secure: false,
//                             auth: {
//                                 user: process.env.EMAIL, // Your email address
//                                 pass: process.env.PASSWORD // Your email password or application-specific password
//                             }
//                         });

//                         const mailOptions = {
//                             from: process.env.EMAIL, // Sender email address
//                             to: orderDetails.email, // Recipient email address
//                             subject: 'Cafe Management System - Bill',
//                             text: 'Please find the attached bill for your order.',
//                             attachments: [
//                                 {
//                                     filename: orderDetails.uuid + '.pdf',
//                                     path: pdfPath
//                                 }
//                             ]
//                         };

//                         transporter.sendMail(mailOptions, (error, info) => {
//                             if (error) {
//                                 console.log(error);
//                                 return res.status(500).json({ error: 'Bill Cannot to Email' });
//                             } else {
//                                 console.log('Email sent:', info.response);
//                                 // res.json({ success: true, message: 'PDF generated and email sent successfully' });
//                                 return res.status(200).json({ message: 'PDF sent successfully to Email' });

//                             }
//                         });
//                     }
//                 });
//             }
//         });
//     }
// });


//--------------------Get Bills API-----------------------------------
router.get('/getBills', auth.authenticateToken, (req, res, next) => {
    var query = "select * from bill order by id DESC";  //DESC-->decreasing order
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


//--------------------Delete Bill API--------------------------------
router.delete('/delete/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from bill where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ "message": "Bill id does not found" });
            }
            return res.status(200).json({ "message": "Bill deleted successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;