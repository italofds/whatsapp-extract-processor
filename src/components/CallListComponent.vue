<template>
	<div class="table-responsive">
		<table class="table table-striped table-hover mb-0">
			<thead>
				<tr>
					<th class="text-nowrap" scope="col">#</th>
					<th class="text-nowrap" scope="col">ID da Chamada</th>
					<th class="text-nowrap" scope="col">Criador da Chamada</th>
					<th class="text-nowrap" scope="col">Tipo</th>
					<th class="text-nowrap text-center" scope="col">Data</th>
					<th class="text-nowrap text-center" scope="col">Hora</th>
					<th class="text-nowrap" scope="col">Origem</th>
					<th class="text-nowrap" scope="col">Destino</th>
					<th class="text-nowrap" scope="col">Endereço IP</th>
					<th class="text-nowrap" scope="col">Porta Lógica</th>
					<th class="text-nowrap" scope="col">País</th>
					<th class="text-nowrap" scope="col">UF</th>
					<th class="text-nowrap" scope="col">Cidade</th>
					<th class="text-nowrap" scope="col">ISP</th>
					<th class="text-nowrap" scope="col">Tipo de Mídia</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(resultObj, index) in finalList" :key="index" :class="ispData[resultObj.ispIndex].status">
					<td>
						<div v-if="ispData[resultObj.ispIndex].status == 'loading'" class="spinner-border spinner-border-sm" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
						<i v-if="ispData[resultObj.ispIndex].status == 'error'" class="text-danger bi bi-x-circle-fill"></i>
						<i v-if="ispData[resultObj.ispIndex].status == 'success'" class="text-success bi bi-check-circle-fill"></i>
					</td>

					<td class="text-nowrap">{{ printValue(resultObj.callId) }}</td>
					<td class="text-nowrap">{{ printValue(formatPhoneNumber(resultObj.callCreator)) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.type) }}</td>					
					<td class="text-nowrap text-center">{{ formatDate(resultObj.timestamp, "DD/MM/YYYY", timezoneData) }}</td>
					<td class="text-nowrap text-center">{{ formatDate(resultObj.timestamp, "HH:mm:ss", timezoneData) }}</td>					
					<td class="text-nowrap">{{ printValue(formatPhoneNumber(resultObj.from)) }}</td>
					<td class="text-nowrap">{{ printValue(formatPhoneNumber(resultObj.to)) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.ip) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.port) }}</td>
					<td class="text-nowrap">{{ printValue(ispData[resultObj.ispIndex].country) }}</td>
					<td class="text-nowrap">{{ printValue(ispData[resultObj.ispIndex].region) }}</td>
					<td class="text-nowrap">{{ printValue(ispData[resultObj.ispIndex].city) }}</td>
					<td class="text-nowrap">{{ printValue(ispData[resultObj.ispIndex].isp) }}</td>
					<td class="text-nowrap">{{ printValue(resultObj.mediaType) }}</td>
				</tr>
			</tbody>
		</table>
	</div>

	<p class="text-center">Exibindo registros do {{firstVisibleItem}} ao {{lastVisibleItem}}.</p>

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
					<div class="input-group-text" id="btnGroupAddon">Nº Página:</div>
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
		ipData: null,
		ispData: null,
		timezoneData: null
	},
	data() {
		return {
			MAX_ITENS_PER_PAGE: 100,
			currentPage: 1
		};
	},
    watch: {
        ipData: {
            deep: true,
            handler() {
                this.restartList();
            }
        }
    },
	computed: {
		maxPages: function () {
			if(this.ipData) {
				return Math.ceil(this.ipData.length / this.MAX_ITENS_PER_PAGE);
			}
			return null;
		},
		firstVisibleItem: function() {
			return (this.currentPage-1) * this.MAX_ITENS_PER_PAGE;
		},
		lastVisibleItem: function() {
			var itemIndex = ((this.currentPage-1) * this.MAX_ITENS_PER_PAGE) + this.MAX_ITENS_PER_PAGE;

			if(this.ipData && itemIndex > this.ipData.length) {
				itemIndex = this.ipData.length;
			}
			return itemIndex;
		},
		finalList: function() {
			if(this.ipData && this.ipData.length > 0) {
				return this.ipData.slice(this.firstVisibleItem, this.lastVisibleItem);
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
		exportExcel() {
			var exportDataList = [];

			for(let resultItem of this.ipData) {
				var exportData = {
					"ID da Chamada" : this.printValue(resultItem.callId),
					"Criador da Chamada" : this.printValue(resultItem.callCreator),
					"Tipo" : this.printValue(resultItem.type),
					"Data" : this.formatDate(resultItem.timestamp, "DD/MM/YYYY", this.timezoneData),
					"Hora" : this.formatDate(resultItem.timestamp, "HH:mm:ss", this.timezoneData),					
					"Origem" : this.printValue(resultItem.from),
					"Destino" : this.printValue(resultItem.to),
					"Endereço IP (Remetente)" : this.printValue(resultItem.ip),
					"Porta Lógica (Remetente)" : this.printValue(resultItem.port),					
					"País" : this.printValue(this.ispData[resultItem.ispIndex].country), 
					"UF" : this.printValue(this.ispData[resultItem.ispIndex].region), 
					"Cidade" : this.printValue(this.ispData[resultItem.ispIndex].city), 
					"ISP" : this.printValue(this.ispData[resultItem.ispIndex].isp),
					"Tipo de Mídia" : this.printValue(resultItem.mediaType)
				};
				exportDataList.push(exportData);
			}			

			var worksheet = XLSX.utils.json_to_sheet(exportDataList);					
			var workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Mensagens");
			XLSX.writeFile(workbook, "whatsapp-extract-result.xlsx");
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