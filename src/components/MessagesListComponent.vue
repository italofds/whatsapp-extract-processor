<template>
	<div class="table-responsive">
		<table class="table table-striped table-hover mb-0">
			<thead>
				<tr>					
					<th class="text-nowrap" scope="col">#</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.msgId') }}</th>
					<th class="text-nowrap text-center" scope="col">{{ $t('messagesList.date') }}</th>
					<th class="text-nowrap text-center" scope="col">{{ $t('messagesList.time') }}</th>					
					<th class="text-nowrap" scope="col">{{ $t('messagesList.sender') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.recipients') }}</th>
					<th class="text-nowrap text-center" scope="col">{{ $t('messagesList.groupId') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.ipAddressSender') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.portSender') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.country') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.region') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.city') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.isp') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.device') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.type') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.msgStyle') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('messagesList.msgSize') }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(resultObj, index) in finalList" :key="index" :class="ispList?.[resultObj.ispIndex].status">
					<td>
						<div v-if="ispList?.[resultObj.ispIndex].status == ''" class="spinner-border spinner-border-sm text-primary" role="status">
							<span class="visually-hidden">{{ $t('app.loading') }}</span>
						</div>
						<i v-if="ispList?.[resultObj.ispIndex].status == 'error'" class="text-danger bi bi-x-circle-fill"></i>
						<i v-if="ispList?.[resultObj.ispIndex].status == 'success'" class="text-success bi bi-check-circle-fill"></i>
					</td>
					
					<td class="text-nowrap">{{ printValue(resultObj.msgId) }}</td>
					<td class="text-nowrap text-center">{{ formatDate(resultObj.timestamp, "DD/MM/YYYY", timezoneData) }}</td>
					<td class="text-nowrap text-center">{{ formatDate(resultObj.timestamp, "HH:mm:ss", timezoneData) }}</td>					
					<td class="text-nowrap">{{ printId(resultObj.sender) }}</td>
					<td class="text-nowrap">
						<span v-if="isMultipleRecipients(resultObj.recipients)" :title="resultObj.recipients">{{ $t('messagesList.multiple') }}</span>
						<span v-if="!isMultipleRecipients(resultObj.recipients)">{{ printId(resultObj.recipients) }}</span>
					</td>
					<td class="text-nowrap text-center">{{ printValue(resultObj.groupId) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.ip) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.port) }}</td>
					<td class="text-nowrap">{{ printValue(ispList?.[resultObj.ispIndex].country) }}</td>
					<td class="text-nowrap">{{ printValue(ispList?.[resultObj.ispIndex].region) }}</td>
					<td class="text-nowrap">{{ printValue(ispList?.[resultObj.ispIndex].city) }}</td>
					<td class="text-nowrap">{{ printValue(ispList?.[resultObj.ispIndex].isp) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.senderDevice) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.type) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.msgStyle) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.msgSize) }}</td>
				</tr>
			</tbody>
		</table>
	</div>

	<p class="text-center mt-3">{{ $t('app.showingRecords') }} {{firstVisibleItem}} {{ $t('app.to') }} {{lastVisibleItem}}.</p>

	<div class="d-flex justify-content-center">
		<div class="row row-cols-lg-auto g-3 mb-3">

			<div class="col-12 d-grid d-lg-block">
				<div class="btn-group" role="group">
					<button @click="firstPage" type="button" class="btn btn-outline-secondary" :disabled="currentPage == 1">
						<i class="bi bi-chevron-double-left"></i>
					</button>
					<button @click="previewsPage" type="button" class="btn btn-outline-secondary" :disabled="currentPage == 1">
						<i class="bi bi-chevron-left"></i>
					</button>
				</div>
			</div>

			<div class="col-12 d-grid d-lg-block">
				<div class="input-group">
					<div class="input-group-text" id="btnGroupAddon">{{ $t('app.pageNumber') }}</div>
					<input v-model="currentPage" type="number" class="form-control text-center" step="1" min="1" :max="maxPages" aria-label="List Page" aria-describedby="List Page">
				</div>
			</div>

			<div class="col-12 d-grid d-lg-block">
				<div class="btn-group" role="group">
					<button @click="nextPage" type="button" class="btn btn-outline-secondary" :disabled="currentPage == maxPages">
						<i class="bi bi-chevron-right"></i>
					</button>
					<button @click="lastPage" type="button" class="btn btn-outline-secondary" :disabled="currentPage == maxPages">
						<i class="bi bi-chevron-double-right"></i>
					</button>
				</div>
			</div>			
		</div>
	</div>
</template>

<script>
import * as XLSX from 'xlsx';
import { formatDate, formatPhoneNumber } from '@/utils/utils.js';

export default {
	name: 'MessagesListComponent',
	props: {
		processedData: null,
		timezoneData: null
	},
	data() {
		return {
			MAX_ITENS_PER_PAGE: 100,
			currentPage: 1
		};
	},
    watch: {
        messageLogs: {
            deep: true,
            handler() {
                this.restartList();
            }
        }
    },
	computed: {
		messageLogs: function() {
            if(this.processedData) {
                return this.processedData.messageLogs;
            }
            return null;            
        },
		ispList: function() {
            if(this.processedData) {
                return this.processedData.ispList;
            }
            return null;
        },
		maxPages: function () {
			if(this.messageLogs) {
				return Math.ceil(this.messageLogs.length / this.MAX_ITENS_PER_PAGE);
			}
			return null;
		},
		firstVisibleItem: function() {
			return (this.currentPage-1) * this.MAX_ITENS_PER_PAGE;
		},
		lastVisibleItem: function() {
			var itemIndex = ((this.currentPage-1) * this.MAX_ITENS_PER_PAGE) + this.MAX_ITENS_PER_PAGE;

			if(this.messageLogs && itemIndex > this.messageLogs.length) {
				itemIndex = this.messageLogs.length;
			}
			return itemIndex;
		},
		finalList: function() {
			if(this.messageLogs && this.messageLogs.length > 0) {
				return this.messageLogs.slice(this.firstVisibleItem, this.lastVisibleItem);
			} 
			return null;
		}
	},
	methods: {
		formatDate,
		formatPhoneNumber,
		isMultipleRecipients(recipients) {
			if(recipients) {
				var recipientsArray = recipients.split(",");
				if(recipientsArray && recipientsArray.length > 1) {
					return true;
				}
			}			
			return false;
		},
		restartList() {
			this.currentPage = 1;
		},
		printValue: function (value) {
			return value ? value.substring(0, 32767) : "-";
		},
		printId: function (value) {
			if(value) {
				var contactNum = this.formatPhoneNumber(value);
				var contactName = this.getContact(value)?.name;				

				if(contactName) {
					return `${contactNum} (${contactName})`;
				} else {
					return contactNum;
				}   
            } else {
                return "-";
            }
		},
		getContact(id) {
            if(this.processedData && this.processedData.contactList) {
                for(let contact of this.processedData.contactList) {
                    if(contact.accountId == id) {
                        return contact;
                    }
                }
            }

            return null;
        },
		exportExcel() {
			var exportDataList = [];

			for(let resultItem of this.messageLogs) {
				var exportData = {
					[ this.$t('messagesList.msgId') ] : this.printValue(resultItem.msgId),
					[ this.$t('messagesList.date') ] : this.formatDate(resultItem.timestamp, "DD/MM/YYYY", this.timezoneData),
					[ this.$t('messagesList.time') ] : this.formatDate(resultItem.timestamp, "HH:mm:ss", this.timezoneData),					
					[ this.$t('messagesList.sender') ] : this.printId(resultItem.sender),
					[ this.$t('messagesList.recipients') ] : this.isMultipleRecipients(resultItem.recipients) ? resultItem.recipients : this.printId(resultItem.recipients),
					[ this.$t('messagesList.groupId') ] : this.printValue(resultItem.groupId),
					[ this.$t('messagesList.ipAddressSender') ] : this.printValue(resultItem.ip),
					[ this.$t('messagesList.portSender') ] : this.printValue(resultItem.port),					
					[ this.$t('messagesList.country') ] : this.printValue(this.ispList?.[resultItem.ispIndex].country), 
					[ this.$t('messagesList.region') ] : this.printValue(this.ispList?.[resultItem.ispIndex].region), 
					[ this.$t('messagesList.city') ] : this.printValue(this.ispList?.[resultItem.ispIndex].city), 
					[ this.$t('messagesList.isp') ] : this.printValue(this.ispList?.[resultItem.ispIndex].isp),
					[ this.$t('messagesList.device') ] : this.printValue(resultItem.senderDevice),
					[ this.$t('messagesList.type') ] : this.printValue(resultItem.type),
					[ this.$t('messagesList.msgStyle') ] : this.printValue(resultItem.msgStyle),
					[ this.$t('messagesList.msgSize') ] : this.printValue(resultItem.msgSize)
				};
				exportDataList.push(exportData);
			}			

			var worksheet = XLSX.utils.json_to_sheet(exportDataList);					
			var workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, this.$t('messagesList.msgs'));
			XLSX.writeFile(workbook, `${this.processedData?.requestParams?.accountId}-whatsapp-messages.xlsx`);
		},
		previewsPage() {
			if(this.currentPage > 1) {
				this.currentPage -= 1;
			}
		},
		firstPage() {
			this.currentPage = 1;
		},
		nextPage() {
			if(this.currentPage < this.maxPages) {
				this.currentPage += 1;
			}
		},
		lastPage() {
			this.currentPage = this.maxPages;
		}
	}
};
</script>