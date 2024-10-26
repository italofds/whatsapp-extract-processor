import { parse } from 'node-html-parser';

onmessage = function(e) {
    const files = e.data.files;
	let requestParams = {};
	let msgs = [];
	let calls = [];

	(async () => {
		const processFile = (file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					startProcess(e.target.result)
					.then(result => resolve(result))
					.catch(error => reject(error));
				};
				reader.onerror = (e) => reject(e);
				reader.readAsText(file);
			});
		};
		
		for(let i = 0; i < files.length; i++) {
			postMessage({
				progress: Math.floor(i / files.length * 100)
			});

			let file = files[i];
			const fileResult = await processFile(file);

			if(fileResult && fileResult.requestParams) {
				requestParams = fileResult.requestParams;
			}

			if(fileResult && fileResult.messageLogs) {
				msgs = msgs.concat(...fileResult.messageLogs);
			}

			if(fileResult && fileResult.callLogs) {
				calls = calls.concat(...fileResult.callLogs);
			}			
		}

		postMessage({
			result: {
				requestParams: requestParams,
				messageLogs: msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
				callLogs: calls.sort((a, b) => new Date(a.events[0].timestamp) - new Date(b.events[0].timestamp))
			}
		});
	})();
};

async function startProcess(htmlString) {
	//Disable source loading from 'src' and 'href' attributes
    htmlString = htmlString.replace(/src=/gi, 'data-src=').replace(/href=/gi, 'data-href=');

    // Parse HTML to a DOM object
    const root = parse(htmlString);

    //Remove all page breaks
    root.querySelectorAll('.pageBreak, script, style, noscript').forEach(element => element.remove());

    //Get only text from html and replace all white spaces and line breaks
    const text = root.innerText.replace(/\s+/g, '');
	
	const resultObj = {
		requestParams: getRequestParams(text),
		messageLogs: getMessageLogs(text),
		callLogs: getCallLogs(text),
	}

	return resultObj;    
}

function getRequestParams(text) {
	const accountIdRegex = /AccountIdentifier\+(.*?)AccountType/;

	const obj = {};

	const accountIdMatch = accountIdRegex.exec(text);		
	if (accountIdMatch) {
		obj.accountId = `${accountIdMatch[1]}`;
	}

	return obj;
}

function getMessageLogs(text) {
	const msgBlockRegex = /MessageTimestamp[\s\S]*?(?=MessageTimestamp|CallLog)/g;
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
	const msgSizeRegex = /MessageSize(.*)/;

	let objArray = [];
	let match;
	while ((match = msgBlockRegex.exec(text)) !== null) {
		const block = match[0];
		const obj = {};

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

	return objArray;
}

function getCallLogs(text) {
	const callBlockRegex = /CallCallId[\s\S]*?(?=CallCallId|$)/g;
	const callIdRegex = /CallId(.*?)CallCreator/;
	const callCreatorRegex = /CallCreator(.*?)Events/;
	const eventsRegex = /Events(.*)/;
	const eventBlockRegex = /Type[\s\S]*?(?=Type|$)/g
	const eventTypeRegex = /Type(.*?)Timestamp/;
	const eventTimestampRegex = /Timestamp(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})UTCFrom/;
	const eventFromRegex = /From(.*?)To/;
	const eventToRegex = /To(.*?)FromIp/;
	const eventFromIpRegex = /FromIp(.*?)FromPort/;
	const eventFromPortRegex = /FromPort(.*?)(?=Media|$)/;
	const eventMediaTypeRegex = /Media(.*)/;

	let objArray = [];
	let match;
	while ((match = callBlockRegex.exec(text)) !== null) {
		const block = match[0];
		const obj = {};

		const callIdMatch = callIdRegex.exec(block);		
		if (callIdMatch) {
			obj.callId = callIdMatch[1];
		}

		const callCreatorMatch = callCreatorRegex.exec(block);
		if (callCreatorMatch) {
			obj.callCreator = callCreatorMatch[1];
		}

		const eventsMatch = eventsRegex.exec(block);
		if (eventsMatch) {
			let eventsText = eventsMatch[1];
			eventsText = eventsText.replace(/MediaType/g, 'Media');

			let eventBlockMatch;			
			while ((eventBlockMatch = eventBlockRegex.exec(eventsText)) !== null) {
				const eventBlock = eventBlockMatch[0];
				const eventObj = {};

				const eventTypeMatch = eventTypeRegex.exec(eventBlock);		
				if (eventTypeMatch) {
					eventObj.type = eventTypeMatch[1];
				}

				const eventTimestampMatch = eventTimestampRegex.exec(eventBlock);		
				if (eventTimestampMatch) {
					eventObj.timestamp = `${eventTimestampMatch[1]} ${eventTimestampMatch[2]} UTC`;
				}

				const eventFromMatch = eventFromRegex.exec(eventBlock);		
				if (eventFromMatch) {
					eventObj.from = eventFromMatch[1];
				}

				const eventToMatch = eventToRegex.exec(eventBlock);		
				if (eventToMatch) {
					eventObj.to = eventToMatch[1];
				}

				const eventFromIpMatch = eventFromIpRegex.exec(eventBlock);		
				if (eventFromIpMatch) {
					eventObj.ip = formatIP(eventFromIpMatch[1]);
				}

				const eventFromPortMatch = eventFromPortRegex.exec(eventBlock);		
				if (eventFromPortMatch) {
					eventObj.port = eventFromPortMatch[1];
				}

				const eventMediaTypeMatch = eventMediaTypeRegex.exec(eventBlock);		
				if (eventMediaTypeMatch) {
					eventObj.mediaType = eventMediaTypeMatch[1];
				}

				if(!obj.events) {
					obj.events = [];	
				}
				obj.events.push(eventObj); 
			}
		}		

		objArray.push(obj);
	}

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
