<template>
	<div class="table-responsive">
		<table class="table table-striped table-hover mb-0">
			<thead>
				<tr>
					<th class="text-nowrap" scope="col">#</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.callId') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.callCreator') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.type') }}</th>
					<th class="text-nowrap text-center" scope="col">{{ $t('callList.date') }}</th>
					<th class="text-nowrap text-center" scope="col">{{ $t('callList.time') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.origin') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.destination') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.ipAddress') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.port') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.country') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.region') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.city') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.isp') }}</th>
					<th class="text-nowrap" scope="col">{{ $t('callList.mediaType') }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(resultObj, index) in visibleList" :key="index" :class="ispList?.[resultObj.ispIndex].status">
					<td>
						<div v-if="ispList?.[resultObj.ispIndex].status == ''" class="spinner-border spinner-border-sm text-primary" role="status">
							<span class="visually-hidden">{{ $t('app.loading') }}</span>
						</div>
						<i v-if="ispList?.[resultObj.ispIndex].status == 'error'" class="text-danger bi bi-x-circle-fill"></i>
						<i v-if="ispList?.[resultObj.ispIndex].status == 'success'" class="text-success bi bi-check-circle-fill"></i>
					</td>

					<td class="text-nowrap">{{ printValue(resultObj.callId) }}</td>
					<td class="text-nowrap">{{ printId(resultObj.callCreator) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.type) }}</td>					
					<td class="text-nowrap text-center">{{ formatDate(resultObj.timestamp, "DD/MM/YYYY", timezoneData) }}</td>
					<td class="text-nowrap text-center">{{ formatDate(resultObj.timestamp, "HH:mm:ss", timezoneData) }}</td>					
					<td class="text-nowrap">{{ printId(resultObj.from) }}</td>
					<td class="text-nowrap">{{ printId(resultObj.to) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.ip) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.port) }}</td>
					<td class="text-nowrap">{{ printValue(ispList?.[resultObj.ispIndex].country) }}</td>
					<td class="text-nowrap">{{ printValue(ispList?.[resultObj.ispIndex].region) }}</td>
					<td class="text-nowrap">{{ printValue(ispList?.[resultObj.ispIndex].city) }}</td>
					<td class="text-nowrap">{{ printValue(ispList?.[resultObj.ispIndex].isp) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.mediaType) }}</td>
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
	name: 'CallListComponent',
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
        callLogs: {
            deep: true,
            handler() {
                this.restartList();
            }
        }
    },
	computed: {
		callLogs: function() {
            if(this.processedData && this.processedData.callLogs) {
                return this.processedData.callLogs.flatMap(call => 
                    call.events.map(event => ({ ...event, callId: call.callId, callCreator: call.callCreator }))
                );
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
			if(this.callLogs) {
				return Math.ceil(this.callLogs.length / this.MAX_ITENS_PER_PAGE);
			}
			return null;
		},
		firstVisibleItem: function() {
			return (this.currentPage-1) * this.MAX_ITENS_PER_PAGE;
		},
		lastVisibleItem: function() {
			var itemIndex = ((this.currentPage-1) * this.MAX_ITENS_PER_PAGE) + this.MAX_ITENS_PER_PAGE;

			if(this.callLogs && itemIndex > this.callLogs.length) {
				itemIndex = this.callLogs.length;
			}
			return itemIndex;
		},
		visibleList: function() {
			if(this.callLogs && this.callLogs.length > 0) {
				return this.callLogs.slice(this.firstVisibleItem, this.lastVisibleItem);
			} 
			return null;
		}
	},
	methods: {
		formatDate,
		formatPhoneNumber,
		isMultipleRecipients(recipients) {
			var recipientsArray = recipients.split(",");
			if(recipientsArray && recipientsArray.length > 1) {
				return true;
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

			for(let resultItem of this.callLogs) {
				var exportData = {
					[ this.$t('callList.callId') ] : this.printValue(resultItem.callId),
					[ this.$t('callList.callCreator') ] : this.printId(resultItem.callCreator),
					[ this.$t('callList.type') ] : this.printValue(resultItem.type),
					[ this.$t('callList.date') ] : this.formatDate(resultItem.timestamp, "DD/MM/YYYY", this.timezoneData),
					[ this.$t('callList.time') ] : this.formatDate(resultItem.timestamp, "HH:mm:ss", this.timezoneData),					
					[ this.$t('callList.origin') ] : this.printId(resultItem.from),
					[ this.$t('callList.destination') ] : this.printId(resultItem.to),
					[ this.$t('callList.ipAddressSender') ] : this.printValue(resultItem.ip),
					[ this.$t('callList.portSender') ] : this.printValue(resultItem.port),					
					[ this.$t('callList.country') ] : this.printValue(this.ispList?.[resultItem.ispIndex].country), 
					[ this.$t('callList.region') ] : this.printValue(this.ispList?.[resultItem.ispIndex].region), 
					[ this.$t('callList.city') ] : this.printValue(this.ispList?.[resultItem.ispIndex].city), 
					[ this.$t('callList.isp') ] : this.printValue(this.ispList?.[resultItem.ispIndex].isp),
					[ this.$t('callList.mediaType') ] : this.printValue(resultItem.mediaType)
				};
				exportDataList.push(exportData);
			}			

			var worksheet = XLSX.utils.json_to_sheet(exportDataList);					
			var workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, this.$t('callList.calls'));
			XLSX.writeFile(workbook, `${this.processedData?.requestParams?.accountId}-whatsapp-calls.xlsx`);
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