    // //criamos um servidor tcp (funcao net) que recebe 
    // uma funcao callback que implementa o mqtt (aedes.handle)
    
    const express = require('express');//framework web
    const bodyParser = require('body-parser'); //recebe e manipula arquivos json da requisicao post
    const aedes = require('aedes')();//mqtt library
    const cors = require('cors');//libera acesso a outros dominios

    const app = express();
    app.use(cors());


    const mqttServer = require('net').createServer(aedes.handle);
    const mqttPort = 1883;

    mqttServer.listen(mqttPort, ()=>{
        console.log(`MQTT server is running on port ${mqttPort}`);
    });

    aedes.on('client', (client)=>{
        console.log("New client connected: ", client)
    });

    aedes.on('clientDisconnect', (client)=>{
        console.log("Client disconnected: ", client);
    })

    //  aedes.on('publish', (packet, client)=>{
    //       console.log(`Mensagem recebida pelo cliente ${client} - Tópico: ${packet.topic} => ${packet.payload.toString()}`)
    //    })

      aedes.on('publish', async function (packet, client) {
    console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
  })




    
    app.use(bodyParser.json());
    app.get('/', (req, res)=>{
        res.send({message:"API MQTT TESTE."});
        });

        //metodo mensagens personalizadas
        app.post('/echo', (req, res)=>{
            const {email, senha} = req.body
            console.log(email);
            console.log(senha);
            res.send(req.body);

            
        });

        app.post('/send', (req, res)=>{
            try {
                const mensagem = req.body.mensagem;
                console.log(mensagem)
                aedes.publish({topic:'esp32/data', payload:mensagem});
                res.status(200).send({message: 'Message published.'});
            
            
            } catch (error) {
                console.error("FALHA AO PUBLICAR MENSAGEM:", error.message);
                res.status(500).send({ error: 'Failed to publish message.' });
                
            }

        })

        const port = 3000;
        app.listen(port,()=>{
            console.log("Servidor rodando na porta " +port);

        })


