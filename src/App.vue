<template>
	<div class="d-flex flex-column vh-100">
		<header class="navbar navbar-expand navbar-dark bg-dark shadow flex-shrink-0 z-2">
			<div class="container-fluid">

				<div>
					<button v-if="processedData" class="navbar-toggle btn btn-dark d-inline-block me-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					
					<div class="navbar-brand d-inline-block my-1">
						<svg class="bi text-secondary h2 mb-0 align-middle me-3"><use href="#whatsapp"></use></svg>
						<a class="text-light align-middle d-sm-inline d-none" href="https://github.com/italofds" target="_blank">italofds</a>
						<span class="text-secondary align-middle d-sm-inline d-none"> / </span>
						<a class="text-light align-middle" href="https://github.com/italofds/whatsapp-extract-processor" target="_blank">whatsapp-extract-processor</a>
						<span class="badge rounded-pill text-bg-secondary align-middle ms-3" style="font-size:10pt;"><small>BETA</small></span>
					</div>
				</div>
					
				<div class="dropdown">
					<button class="btn btn-dark dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Alterar Tema">
						<svg class="bi my-1 theme-icon-active"><use href="#circle-half"></use></svg>
						<span class="d-none ms-2" id="bd-theme-text">Alterar Tema</span>
					</button>
					<ul id="dropdown-theme" class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
						<li>
							<button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
								<svg class="bi me-2 opacity-50"><use href="#sun-fill"></use></svg>
								Claro
								<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
							</button>
						</li>
						<li>
							<button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
								<svg class="bi me-2 opacity-50"><use href="#moon-stars-fill"></use></svg>
								Escuro
								<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
							</button>
						</li>
						<li>
							<button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
								<svg class="bi me-2 opacity-50"><use href="#circle-half"></use></svg>
								Auto
								<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
							</button>
						</li>
					</ul>
					
					<svg xmlns="http://www.w3.org/2000/svg" class="d-none">
						<symbol id="check2" viewBox="0 0 16 16">
							<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
						</symbol>
						<symbol id="circle-half" viewBox="0 0 16 16">
							<path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
						</symbol>
						<symbol id="moon-stars-fill" viewBox="0 0 16 16">
							<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
							<path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
						</symbol>
						<symbol id="sun-fill" viewBox="0 0 16 16">
							<path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
						</symbol>
						<symbol id="whatsapp" viewBox="0 0 16 16">
							<path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
						</symbol>
						<symbol id="message" viewBox="0 0 16 16">
							<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
							<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
						</symbol>
						<symbol id="call" viewBox="0 0 16 16">
							<path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
						</symbol>
						<symbol id="chart" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"/>
						</symbol>
						<symbol id="view" viewBox="0 0 16 16">
							<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
							<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
						</symbol>
						<symbol id="restart" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"/>
						</symbol>
					</svg>
				</div>
				
			</div>
		</header>	

		<main id="start"  class="flex-grow-1 overflow-hidden position-relative">
			<div class="d-flex flex-row h-100">
				<div v-if="processedData" id="navbarToggleExternalContent" class="menu collapse show overflow-auto shadow z-1">
					<div class="d-flex flex-column h-100">
						<h4 class="p-3 border-bottom bg-body-secondary mb-0">
							Extrato de Chamadas/Mensagens
						</h4>
						<div class="px-3">
							<div class="d-flex my-4">
								<img :src="`./img/whatsapp.png`" class="border bg-light rounded" style="width:110px;" />
								<div class="ms-3 align-self-center">
									<h5>
										{{formatPhoneNumber(processedData.requestParams.accountId)}}
										<small class="text-body-secondary fw-light">(Tel. Alvo)</small>
									</h5>

									<ul class="list-unstyled mb-0">
										<li><strong>{{processedData.messageLogs.length}}</strong> registros de mensagens</li>
										<li><strong>{{processedData.callLogs.length}}</strong> registros de chamadas</li>
										<li>De <strong>{{formatDate(startDate, "DD/MM/YYYY", selectedTimezone)}}</strong> a <strong>{{formatDate(finalDate, "DD/MM/YYYY", selectedTimezone)}}</strong></li>
									</ul>
								</div>
							</div>

							<div v-if="processedIspCount != processedData.ispList?.length" class="alert mb-4 alert-warning" role="alert">
								<div class="spinner-border spinner-border-sm me-3"><span class="visually-hidden">Loading...</span></div>
								<span>Consultando IP's: <strong>{{ processedIspCount }}</strong> de <strong>{{ processedData.ispList?.length }}</strong> </span>
							</div>

							<div v-if="errorIspCount && processedIspCount == processedData.ispList?.length" class="alert mb-4 alert-danger alert-dismissible fade show" role="alert">
								<i class="text-danger bi bi-x-circle-fill me-3"></i>
								<span>Não foi possível consultar <strong>{{ errorIspCount }}</strong> IP(s).</span>
								<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
							</div>

							<div v-if="loadingWaAccount > 0" class="alert mb-4 alert-warning" role="alert">
								<div class="spinner-border spinner-border-sm me-3"><span class="visually-hidden">Loading...</span></div>
								<span>Consultando perfis WhatsApp: <strong>{{ loadedWaAccount }}</strong> de <strong>{{ processedData.contactList.length }}</strong> </span>
							</div>

							<div class="mb-3">
								<label for="selectTimezone" class="form-label">Fuso Horário</label>
								<select v-model="selectedTimezone" class="form-select">
									<option v-for="item in timezoneItens" :value="item.id" :key="item.id">{{ item.text }}</option>
								</select>
							</div>

							<ul class="nav nav-tabs mb-3">
								<li class="nav-item">
									<span class="nav-link active" role="tab">Menu</span>
								</li>
							</ul>

							<ul class="nav nav-pills flex-column mb-3">
								<li class="nav-item">
									<router-link to="/messages" :class="[$route.name === 'MessagesPage' ? 'nav-link active' : 'nav-link link-body-emphasis']" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#message"></use></svg>
										Registros de Mensagens
									</router-link>
								</li>
								<li class="nav-item">
									<router-link to="/calls" :class="[$route.name === 'CallsPage' ? 'nav-link active' : 'nav-link link-body-emphasis']" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#call"></use></svg>
										Registros de Chamadas
									</router-link>
								</li>
								<li class="nav-item">
									<router-link to="/charts" :class="[$route.name === 'ChartsPage' ? 'nav-link active' : 'nav-link link-body-emphasis']" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#chart"></use></svg>
										Gráficos
									</router-link>
								</li>
								<li class="nav-item">
									<router-link to="/view" :class="[$route.name === 'ViewPage' ? 'nav-link active' : 'nav-link link-body-emphasis']" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#view"></use></svg>
										Visualização
									</router-link>
								</li>
							</ul>

							<hr/>

							<ul class="nav nav-pills flex-column mb-3">
								<li class="nav-item">
									<a href="#" class="nav-link link-body-emphasis" aria-current="page" data-bs-toggle="modal" data-bs-target="#apiModal">
										<i class="bi bi-code-square me-2" />
										Carregar API WhatsApp
									</a>
									<a class="nav-link link-body-emphasis" aria-current="page" 
										:href="jsonData"
										:download="`WA_${processedData.requestParams.accountId}_from_${formatDate(startDate, 'YYYYMMDD', selectedTimezone)}_to_${formatDate(finalDate, 'YYYYMMDD', selectedTimezone)}.json`">
										<i class="bi bi-floppy me-2" />
										Salvar
									</a>
									<router-link to="/" class="nav-link link-body-emphasis" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#restart"></use></svg>
										Reiniciar
									</router-link>
								</li>
							</ul>
						</div>
					</div>					
				</div>				
				<div class="bg-body-tertiary w-100 overflow-auto">
					<div class="d-flex flex-column h-100">
						<router-view 
							:processedData="processedData" 
							:selectedTimezone="selectedTimezone"
							@updateProcessedData="updateProcessedData" />

						<p class="text-muted small text-center py-3 mb-0">Desenvolvido por <a target="_blank" href="https://github.com/italofds">Ítalo Santos</a> | © 2024 | Licença GPL-3.0 | Hospedado pelo GitHub Pages | Contribua: <a target="_blank" href="https://github.com/italofds/whatsapp-extract-processor">github.com/italofds/whatsapp-extract-processor</a></p>	
					</div>
				</div>
			</div>
		</main>
	</div>

	<div class="modal fade" id="apiModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Consulta Dados</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
					<div class="alert mb-3 alert-info" role="alert">
						<div class="h4 d-flex align-items-center">
							<i class="bi bi-info-circle-fill me-2"></i> 
							<span>Informação:</span>
						</div>
						<p>Essa ferramenta utiliza a API <strong>CheckLeaked</strong> para consultar informações públicas de perfis do WhatsApp.</p>
						<p>Para mais informações sobre como usar e como obter uma chave de API, acesse o site: <a href="https://whatsapp.checkleaked.cc/" target="_blank">whatsapp.checkleaked.cc</a></p>
					</div>
                    <label for="inputApiKey" class="form-label">Chave da API</label>
                    <input v-model="apiKey" type="text" class="form-control" id="inputApiKey">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary"  data-bs-dismiss="modal" @click="fetchWaData()">Consultar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import '@/assets/js/color-modes.js'
import {formatPhoneNumber, formatDate} from '@/utils/utils'

const MAX_DAYS_DIFF = 10;

export default {
	name: 'App',
	data() {
		return { 
			apiKey: null,
			processedData: null,	
			selectedTimezone: -new Date().getTimezoneOffset()
		};
	},
	computed: {
		startDate: function() {
			if (!this.processedData) return null;

			const startDateMessages = this.processedData.messageLogs?.[0]?.timestamp;
			const startDateCalls = this.processedData.callLogs?.[0]?.events?.[0]?.timestamp;

			if (!startDateMessages) return startDateCalls;
			if (!startDateCalls) return startDateMessages;

			return new Date(startDateMessages) < new Date(startDateCalls) ? startDateMessages : startDateCalls;
		},
		finalDate: function() {
			if (!this.processedData) return null;

			const finalDateMessages = this.processedData.messageLogs?.[this.processedData.messageLogs.length-1]?.timestamp;
			const finalDateCalls = this.processedData.callLogs?.[this.processedData.callLogs.length-1]?.events?.[0]?.timestamp;

			if (!finalDateMessages) return finalDateCalls;
			if (!finalDateCalls) return finalDateMessages;

			return new Date(finalDateMessages) > new Date(finalDateCalls) ? finalDateMessages : finalDateCalls;
		},
		endDate: function() {
			return null;
		},
		processedIspCount: function() {
			if(this.processedData && this.processedData.ispList) {
				return this.processedData.ispList.filter(function (obj) {
					return obj.status == "success" || obj.status == "error";
				}).length;
			}
			return 0;
		},
		loadedWaAccount: function() {
			if(this.processedData && this.processedData.contactList) {
				return this.processedData.contactList.filter(function (obj) {
					return obj.status == "success";
				}).length;
			}
			return 0;
		},
		loadingWaAccount: function() {
			if(this.processedData && this.processedData.contactList) {
				return this.processedData.contactList.filter(function (obj) {
					return obj.status == "loading";
				}).length;
			}
			return 0;
		},
		errorIspCount: function() {
			if(this.processedData && this.processedData.ispList) {
				return this.processedData.ispList.filter(function (obj) {
					return obj.status == "error";
				}).length;
			}
			return 0;
		},
		timezoneItens: function() {
			// Get all available timezone names
			const timezones = momentTZ.tz.names();

			// Create a set to hold offsets
			const offsets = [];

			// Iterate over each timezone
			timezones.forEach(tz => {
				// Create a moment object in the specified timezone
				const now = momentTZ().tz(tz);

				// Get the offset in minutes and convert to hours and minutes
				const offset = now.utcOffset();
				const sign = offset >= 0 ? '+' : '-';
				const hours = Math.floor(Math.abs(offset) / 60);
				const minutes = Math.abs(offset) % 60;
				const formattedOffset = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
				
				// Add the formatted offset to the set
				offsets.push({'id' : offset, 'text' : formattedOffset});
			});

			// Remove duplicated offsets
			let uniqueOffsets = offsets.filter(function({id}) {
				return !this.has(id) && this.add(id);
			}, new Set);

			return uniqueOffsets.sort((a,b) => a.id - b.id);		
		},
		jsonData: function() {
			if(this.processedData) {
				const jsonString = JSON.stringify(this.processedData, null, 2);
				const blob = new Blob([jsonString], { type: 'application/json' });
				return URL.createObjectURL(blob);
			}
			return null;
		}
	},
	methods: {
		formatPhoneNumber,
		formatDate,
		updateProcessedData(data) {
			this.processedData = data;	

			if(this.processedData) {
				if(!this.processedData.ispList) {
					this.processedData.ispList = this.generateIspList();
				}

				if(!this.processedData.contactList) {
					this.processedData.contactList = this.generateContactList();
				}			
				
				this.fetchIspData();
			}			
		},
		convertDatetimeFormat: function (dateValue, format) {
			if (dateValue) {
				const utcDate = new Date(dateValue);
				const momentUtcDate = moment.utc(utcDate);
				const targetTime = momentUtcDate.utcOffset(this.selectedTimezone);
				const timeText = targetTime.format(format);
				return timeText;
			}
		},
		generateIspList() {
			var ipList = [];
			const resultIspList = [];

			if(this.processedData.messageLogs) {
				ipList = ipList.concat(...this.processedData.messageLogs);
			}

			for(let call of (this.processedData.callLogs||[])) {
				for(let event of (call.events||[])) {
					ipList.push(event);
				}		
			}		

			for(let resultItem of ipList) {
				var resultIp = resultItem.ip;
				var resultDate = resultItem.timestamp;
				var isRepeated = false;
				var ispIndex = undefined;

				for (let i = 0; i < resultIspList.length; i++) {
					let ispItem = resultIspList[i];

					if(ispItem.ip === resultIp) {
						const difference = Math.abs(new Date(ispItem.timestamp) - new Date(resultDate)) / (1000 * 3600 * 24);
						if(difference <= MAX_DAYS_DIFF){
							isRepeated = true;
							ispIndex = i;
							break;
						}
					}
				}				

				if(!isRepeated) {
					let ispItem = {};
					ispItem.ip = resultIp;
					ispItem.timestamp = resultDate;
					/* ispItem.country = "";
					ispItem.region = "";
					ispItem.city = "";
					ispItem.lat = "";
					ispItem.lng = "";
					ispItem.isp = "";
					ispItem.status = "";	 */				

					resultIspList.push(ispItem);	
					ispIndex = resultIspList.length-1;
					resultItem.ispIndex = ispIndex;							
					
				} else {
					resultItem.ispIndex = ispIndex;
				}				
			}

			console.log("RESULT ISP LIST");
			console.log(resultIspList);

			return resultIspList;
		},
		generateContactList() {
			var waAccountMsgList;
			var waAccountCallList;

			if(this.processedData?.messageLogs) {
				waAccountMsgList = [...new Set(this.processedData.messageLogs
					.filter(item => item.msgStyle === 'individual')
					.map(item => item.sender != this.processedData.requestParams.accountId ? item.sender : item.recipients)
				)];
			}

			if(this.processedData?.callLogs) {
				waAccountCallList = [...new Set(this.processedData.callLogs
					.map(item => item.events[0].from != this.processedData.requestParams.accountId ? item.events[0].from : item.events[0].to)
				)];
			}

			return [...new Set([...waAccountMsgList, ...waAccountCallList])]
				.map(item => {
					return {
						accountId: item,
						status: ""
					}
				});
		},
		async fetchIspData() {
			if(this.processedData && this.processedData.ispList) {
				for(let item of this.processedData.ispList) {
					if(item.ip && !item.status) {
						try {
							item.status = "loading";

							var url  = process.env.VUE_APP_IP_API_URL + item.ip + "/" + this.convertDatetimeFormat(item.timestamp, "YYYY-MM-DD");
							const response = await axios.get(url);

							item.country = response.data.country;
							item.region = response.data.regionName;
							item.city = response.data.city;
							item.isp = response.data.asn;
							item.lat = response.data.location.lat;
							item.lng = response.data.location.lng;
							item.status = "success";
							
						} catch (error) {
							item.status = "error"
							console.error('Ocorreu um erro durante a busca dos dados de IPs: ', error);
						}	
					}					
				}	
			}			
		},
		async fetchWaData() {
			if(this.processedData && this.processedData.contactList) {
				for(let item of this.processedData.contactList){
					if(!item.status) {
						try {
							item.status = "loading";

							const options = {
								method: 'GET',
								url: 'https://whatsapp-data1.p.rapidapi.com/number/' + item.accountId,
								headers: {
									'x-rapidapi-key': this.apiKey,
									'x-rapidapi-host': 'whatsapp-data1.p.rapidapi.com'
								}
							};

							const response = await axios.request(options);

							item.status = "success";

							if(response?.data?.profilePic) {
								item.profilePic = response.data.profilePic;
							}
							if(response?.data?.isBusiness) {
								item.isBusiness = response.data.isBusiness;
								item.description = response.data.businessProfile?.description;
							}
							if(response?.data?.about) {
								item.about = response.data.about;
							}
							
						} catch (error) {
							item.status = "error"
							console.error('Ocorreu um erro durante a fazer consulta na API do WhatsApp: ', error);
						}
					}						
				}
			}            
        } 
	}
}
</script>

<style>
	.form-label {
		font-weight: bold;
	}
	.form-label:after {
		content: ":";
	}

	a.anchor {
		display: block;
		position: relative;
		top: -50px;
		visibility: hidden;
	}

	.bi {
		width: 1em;
		height: 1em;
		vertical-align: -.125em;
		fill: currentcolor;
	}

	.dropdown-menu .active .bi {
		display: block !important;
	}

	.navbar-brand a {
		text-decoration: none;
	}

	.navbar-brand a:hover {
		text-decoration: underline;
	}

	.navbar-icon {
		height: 20px;
	}

	.btn-top {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 3rem;
		height: 3rem;
	}

	.menu{
		min-width: 100%;
		transition: min-width 0.5s ease;
	}

	@media (min-width: 450px) {
		.menu {
			min-width: 450px;
		}
	}

	.menu.collapsing {
		-webkit-transition: none !important;
		transition: none !important;
		display: none !important;
	}
</style>