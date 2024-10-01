import $ from 'jquery';

// It works for both versions of Meta company's responses, before and after 2024. 
// To achieve this, the code searches for elements in tables (old format) or in divs (new format).

export async function fileProcess(htmlString) {
		
	//Disable source loading from 'src' and 'href' attributes
	htmlString = htmlString.replace(/src=/gi, 'data-src=').replace(/href=/gi, 'data-href=');
	const $html = $(htmlString);
	
	//Remove all page breaks
	$html.find('.pageBreak').remove();
	
	//Get only text from html and replace all white spaces and line breaks
	const $htmlText = $html.text().replace(/\s+/g, '');

	const msgBlockRegex = /MessageTimestamp[\s\S]*?(?=MessageTimestamp|$)/g;
	const timestampRegex = /Timestamp(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})UTCMessageId/;
	const msgIdRegex = /MessageId(.*?)Sender/;
	const senderRegex = /Sender(.*?)Recipients/;
	const recipientsRegex = /Recipients(.*?)(?=SenderIp|GroupId)/;
	const groupIdRegex = /GroupId(.*?)SenderIp/;
	const senderIpRegex = /SenderIp(.*?)SenderPort/;
	const senderPortRegex = /SenderPort(.*?)SenderDevice/;
	const senderDeviceRegex = /SenderDevice(.*?)Type/;
	const typeRegex = /Type(.*?)MessageStyle/;
	const msgStyleRegex = /MessageStyle(.*?)MessageSize/;
	const msgSizeRegex = /MessageSize(.*?)/;

	let objArray = [];
	let match;
	while ((match = msgBlockRegex.exec($htmlText)) !== null) {
		var block = match[0];
		var obj = {};

		const timestampMatch = timestampRegex.exec(block);		
		if (timestampMatch) {
			obj.timestamp = `${timestampMatch[1]} ${timestampMatch[2]} UTC`;
		}

		const msgIdMatch = msgIdRegex.exec(block);		
		if (msgIdMatch) {
			obj.msgId = msgIdMatch[1];
		}

		const senderMatch = senderRegex.exec(block);		
		if (senderMatch) {
			obj.sender = senderMatch[1];
		}

		const recipientsMatch = recipientsRegex.exec(block);		
		if (recipientsMatch) {
			obj.recipients = recipientsMatch[1];
		}

		const groupIdMatch = groupIdRegex.exec(block);		
		if (groupIdMatch) {
			obj.groupId = groupIdMatch[1];
		}

		const senderIpMatch = senderIpRegex.exec(block);		
		if (senderIpMatch) {
			obj.ip = formatIP(senderIpMatch[1]);
		}

		const senderPortMatch = senderPortRegex.exec(block);		
		if (senderPortMatch) {
			obj.port = senderPortMatch[1];
		}

		const senderDeviceMatch = senderDeviceRegex.exec(block);		
		if (senderDeviceMatch) {
			obj.senderDevice = senderDeviceMatch[1];
		}

		const typeMatch = typeRegex.exec(block);		
		if (typeMatch) {
			obj.type = typeMatch[1];
		}

		const msgStyleMatch = msgStyleRegex.exec(block);		
		if (msgStyleMatch) {
			obj.msgStyle = msgStyleMatch[1];
		}

		const msgSizeMatch = msgSizeRegex.exec(block);		
		if (msgSizeMatch) {
			obj.msgSize = msgSizeMatch[1];
		}

		objArray.push(obj);
	}
	
	//Find right format: IP Address First then Time or Time First then IP Adress
	/* const format1Regex = /IpAddressesIpAddress((?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4})Time(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})Utc/i;
	const format2Regex = /IpAddressesTime(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})UtcIpAddress((?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4})/i;
	
	const ipTimeArray = [];
	const ipTimeBlockRegex = /IpAddress((?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4})Time(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})Utc/ig;
	const timeIpBlockRegex = /Time(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})UtcIpAddress((?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4})/ig;
	let match;

	//If the file corresponds to format1, process first IP then Time as default format
	if(format1Regex.test($htmlText)) {
		while ((match = ipTimeBlockRegex.exec($htmlText)) !== null) {
			const ip = formatIP(match[1]);
			const date = `${match[2]} ${match[3]} UTC`;
			const ipTimeObj = {"ip" : ip, "timestamp" : date};

			ipTimeArray.push(ipTimeObj);
		}
		
	//If the file corresponds to format1, process first Time then IP as default format
	} else if(format2Regex.test($htmlText)) {		
		while ((match = timeIpBlockRegex.exec($htmlText)) !== null) {
			const ip = formatIP(match[3]);
			const date = `${match[1]} ${match[2]} UTC`;
			const ipTimeObj = {"ip" : ip, "timestamp" : date};

			ipTimeArray.push(ipTimeObj);
		}

	// If none of the formats are found, an error message will appear.
	} else {
		alert("Não foi possível processar o arquivo: não foram encontrados registros de IP e Data no formato esperado.");
	}

	return ipTimeArray; */
	return objArray;
}

function formatIP(IPAddressRaw){
	var ipAddressFormated;
	
	// Check if it's IPv4
	if(IPAddressRaw.indexOf(":") == -1) {
		ipAddressFormated = IPAddressRaw;		
	}
	
	// Check if it's IPv6
	else {
		var arrayIPParts = IPAddressRaw.split(":");
		var arrayIPPartsFormated = [];
		
		for (let ipPart of arrayIPParts) {
			if(ipPart.length < 2) {
				ipPart = "000" + ipPart;
			} else if(ipPart.length < 3) {
				ipPart = "00" + ipPart;
			} else if(ipPart.length < 4) {
				ipPart = "0" + ipPart;
			}
			
			arrayIPPartsFormated.push(ipPart);
		} 
		
		ipAddressFormated = arrayIPPartsFormated.join(":");
	}
	
	return ipAddressFormated.toUpperCase();
}
