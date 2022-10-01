const express = require('express')
const path = require("path")
const app = express()
const cors = require('cors')
const dotenv = require("dotenv").config()
const connectDB = require('./models/ConnectDB')()
const Bookings = require("./models/bookings");
const Contacts = require("./models/contacts");
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.mailApi,
    process.env.mailSecret,
);



 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));


app.get("/",async (req,res)=>{
    res.render("index")
})


// 
app.post("/bookings",async(req,res)=>{
    try {
    if(!req.body){
        return res.json({
            status:false,
            message:"please pass the required fields"
        })
    }
    const {
        serviceType,
        bedRoom,
        bathRoom,
        kitchen,
        homeStatus,
        extra,
        cleaningDate,
        often,
        name,
        lastName,
        email,
        address,
        city,
        state,
        zipcode,
        phone,
        comment
    } = req.body
      
    const saveBookings = new Bookings({
            serviceType,
            bedRoom,
            bathRoom,
            kitchen,
            homeStatus,
            extra,
            cleaningDate,
            often,
            name,
            lastName,
            email,
            address,
            city,
            state,
            zipcode,
            phone,
            comment
        })

        const request = mailjet
                    .post("send", {'version': 'v3.1'})
                    .request({
                      "Messages":[
                        {
                          "From": {
                            "Email": "koredebada@gmail.com",
                            "Name": "Spike N Span "
                          },
                          "To": [
                            {
                              "Email": email,
                              "Name": name
                            },
                            {
                              "Email": process.env.adminEmail,
                              "Name": process.env.adminName
                            }
                          ],
                          "Subject": "New Bookings 🧹",
                          "TextPart": 
                        `
                        serviceType: ${serviceType}
                        bedRoom: ${bedRoom}
                        bathRoom: ${bathRoom}
                        kitchen: ${kitchen}
                        homeStatus: ${homeStatus}
                        extra: ${extra}
                        cleaningDate: ${cleaningDate}
                        often: ${often}
                        name: ${name}
                        lastName: ${lastName}
                        email: ${email}
                        address: ${address}
                        city: ${city}
                        state: ${state}
                        zipcode: ${zipcode}
                        phone: ${phone}
                        comment: ${comment}

                        \n Best Regards
                        \n Spike N Span Team
                        `,
                       
                     
                          "HTMLPart": ``,
                        //   "CustomID": "AppGettingStartedTest"
                        }
                      ]
                    })
                    request
                      .then((result) => {
                        console.log(result.body)
                      })
                      .catch((err) => {
                        console.log(err.statusCode)
                      })



        await saveBookings.save()



        res.status(201).json({
            status:true,
            message:"user created successfully"
        })

    } catch (error) {
       return res.json({
            status:false,
            message:error.message
        })
    }
})

app.post("/contact",async(req,res)=>{
    if (!req.body) {
        return res.status(400).json({
            status:false,
            message:"please send the required fields"
        })
    }
    const {name,email,phone,message} = req.body
    try {
        const newContacts = new Contacts({
            name,
            email,
            phone,
            message
        })

        const request = mailjet
                    .post("send", {'version': 'v3.1'})
                    .request({
                      "Messages":[
                        {
                          "From": {
                            "Email": "koredebada@gmail.com",
                            "Name": "Spike N Span "
                          },
                          "To": [
                            {
                              "Email": email,
                              "Name": name
                            },
                            {
                              "Email": process.env.adminEmail,
                              "Name": process.env.adminName
                            }
                          ],
                          "Subject": "New Contact 🧹",
                          "TextPart": 
                        `
                          name : ${name}
                          email: ${email}
                          phone : ${phone}
                          ${message}

                        \n Best Regards
                        \n Spike N Span Team
                        `,
                       
                     
                          "HTMLPart": ``,
                        //   "CustomID": "AppGettingStartedTest"
                        }
                      ]
                    })
                    request
                      .then((result) => {
                        console.log(result.body)
                      })
                      .catch((err) => {
                        console.log(err.statusCode)
                      })
        await newContacts.save()
        res.status(201).json({
            status:true,
            message:" successfully"
        })

    } catch (error) {
        return res.json({
            status:false,
            message:error.message
        })
    }
})

app.get("/",)


const PORT = 6200;
app.listen(process.env.PORT || PORT, ()=> console.log('server running'))