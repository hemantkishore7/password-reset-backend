const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport")

module.exports = async(email,subject,text)=>{
    try {
        const transport = nodeMailer.createTransport({
          service:process.env.SERVICE,
          port:587,
          secure:true,
          auth:{
            user:process.env.USER,
            pass:process.env.PASS
          }
        })

        await transport.sendMail({
            from:process.env.USER,
            to:email,
            subject:subject,
            text:text,
        })
        console.log("Message: Mail sent successfully");
    } catch (error) {
        console.log(error);
    }
}