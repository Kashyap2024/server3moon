const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse incoming HTML data
app.use(bodyParser.text({ type: 'text/html' }));

// Route to handle POST requests
app.post('/api/html', async (req, res) => {
    try {
        const videoPageContent = req.body;
        // console.log(videoPageContent);

        let fileLink = '';
        let baseUrl = '';
        let newPattern = '';
        let langValue = '';
        let valueBeforeM3u8 = '';
        let dataValue = '';
        let srvValue = '';
        let fileIdValue = '';
        let cValue = '';
        let asnValue = '';
        let spValue = '';
        let frValue = '';
        let cookieFileIdValue = '';
        let lanmatchvaluepipe = '';
        // All Regular Expressions
        const baseUrlRegular = /\|com\|([^|]+(?:\|[^|]+)*)\|file\|/;
        const newPatternRegular = /\|([^|]+)\|([^|]+)\|hls2\|/;
        const langValueRegular = /\|(eng|lang)\|([^|]*_[^|]*)\|/;
        const langValueRegular2 = /\|urlset\|([^|]+)\|/;
        const valueBeforeM3u8Regular = /\|10800\|([^|]+(?:\|[^|]+)*)\|m3u8\|/;
        const dataValueRegular = /\|data\|([^|]+)\|/;
        const srvValueRegular = /\|srv\|([^|]+)\|/;
        const fileIdRegular = /file_id',\s*'([^']+)/;
        const cValueRegular = /c\.7[^]*?([0-9]{2})&/;
        const asnValueRegular = /\|([^|]+)\|asn\|/;
        const spValueRegular = /\|([^|]+)\|sp\|/;
        const frValueRegular = /\|fr\|([^|]+)\|/;
        const cookieValueRegular = /\$.cookie\('file_id',\s*'([^']+)/;
        const newLangValueRegular = /\|master\|([^|]+)\|/; // New regular expression

        // Match regular expressions
        const baseMatch = videoPageContent.match(baseUrlRegular);
        const newPatternMatch = videoPageContent.match(newPatternRegular);
        const langMatch = videoPageContent.match(langValueRegular);
        const langMatch2 = videoPageContent.match(langValueRegular2);
        const m3u8Match = videoPageContent.match(valueBeforeM3u8Regular);
        const dataMatch = videoPageContent.match(dataValueRegular);
        const srvMatch = videoPageContent.match(srvValueRegular);
        const fileIdMatch = videoPageContent.match(fileIdRegular);
        const cMatch = videoPageContent.match(cValueRegular);
        const asnMatch = videoPageContent.match(asnValueRegular);
        const spMatch = videoPageContent.match(spValueRegular);
        const frMatch = videoPageContent.match(frValueRegular);
        const cookieMatch = videoPageContent.match(cookieValueRegular);

        if (baseMatch) {
            const reversedSegments = `com|${baseMatch[1]}`;
            baseUrl = reversedSegments.split('|').reverse().join('.');
            // console.log(`Base URL Result: ${baseUrl}`);
        }

        if (newPatternMatch) {
            const reversebefore = `${newPatternMatch[1]}|${newPatternMatch[2]}|hls2`;
            newPattern = reversebefore.split('|').reverse().join('/');
            // console.log(`New Pattern Result: ${newPattern}`);
        }

        // Handle language value extraction
        if (langMatch) {
            lanmatchvaluepipe = langMatch[2];
            const lanmatchvaluepipe2 = langMatch2[1];
            const draftlanfvalue = lanmatchvaluepipe2.replace('_hin', '').replace('_eng', '');
            langValue = `,${lanmatchvaluepipe},lang/eng/${draftlanfvalue}_eng,.urlset`;
            // console.log(`Lang Value Result: ${langValue}`);
        } else {
            // If langMatch is not found, use the new regular expression
            const newLangMatch = videoPageContent.match(newLangValueRegular);
            if (newLangMatch) {
                lanmatchvaluepipe = newLangMatch[1];
                langValue = `${lanmatchvaluepipe}`;
                // console.log(`Lang Value Result (new regex): ${langValue}`);
            }
        }

        if (m3u8Match) {
            const valueBeforeM3u8pipe = m3u8Match[1];
            const parts = valueBeforeM3u8pipe.split('|');
            if (parts.length === 1) {
                valueBeforeM3u8 = parts[0];
            } else if (parts.length === 2) {
                valueBeforeM3u8 = `${parts[1]}-${parts[0]}`;
            }
            // console.log(`Value Before M3U8: ${valueBeforeM3u8}`);
        }

        if (dataMatch) {
            dataValue = dataMatch[1];
            // console.log(`Data Value Result: ${dataValue}`);
        }

        if (srvMatch) {
            srvValue = srvMatch[1];
            // console.log(`SRV Value Result: ${srvValue}`);
        }

        if (fileIdMatch) {
            fileIdValue = fileIdMatch[1];
            // console.log(`File ID Result: ${fileIdValue}`);
        }

        if (cMatch) {
            const fullCValue = cMatch[0];
            // console.log(`Full C Value: ${fullCValue}`);

            // Extracting the first number that starts with two digits followed by `a-z= &`
            const numberPattern = /[a-z]+= *(\d{2})&/;
            const numberMatch = fullCValue.match(numberPattern);
            if (numberMatch) {
                cValue = numberMatch[1];
                // console.log(`C Value Result: ${cValue}`);
            }
        }

        if (asnMatch) {
            asnValue = asnMatch[1];
            // console.log(`ASN Value Result: ${asnValue}`);
        }

        if (spMatch) {
            spValue = spMatch[1];
            // console.log(`SP Value Result: ${spValue}`);
        }

        if (frMatch) {
            frValue = frMatch[1];
            // console.log(`FR Value Result: ${frValue}`);
        }

        if (cookieMatch) {
            cookieFileIdValue = cookieMatch[1];
            // console.log(`Cookie File ID Result: ${cookieFileIdValue}`);
        }

        // Construct URL
        const modifiedLangValue = lanmatchvaluepipe.replace('_h', '').replace('_x', '');
        const makeUrl = `https://${baseUrl}/${newPattern}/${langValue}/master.m3u8?t=${valueBeforeM3u8}&s=${dataValue}&e=${srvValue}&f=${fileIdValue}&srv=${cValue}&asn=${asnValue}&sp=${spValue}&fr=${modifiedLangValue}`;

        fileLink = makeUrl;
        console.log('Constructed m3u8 link:', fileLink);

        // Fetch the m3u8 link
        const response = await fetch(fileLink);
        console.log('Fetch response status:', response.status);
        return res.json({
            type: 'embed',
            source: fileLink,
            message: 'm3u8 link generated successfully'
        });

        // if (response.ok) {
        //     // const responseData = await response.text();
        // } else {
        //     console.error('Failed to fetch m3u8 link, status:', response.status);
        //     return res.status(response.status).json({ error: 'Failed to fetch m3u8 link' });
        // }
    } catch (error) {
        console.error('Error during processing:', error.message);
        return res.status(500).json({ error: 'Error during processing: ' + error.message });
    }
});

// Start the server
const PORT = 4500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
