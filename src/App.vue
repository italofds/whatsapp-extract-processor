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
						<span class="badge rounded-pill text-bg-secondary align-middle ms-3" style="font-size:10pt;"><small>v.1.0.0</small></span>
					</div>
				</div>
				
				<div class="d-flex flex-row">
					<div class="dropdown">
						<button class="btn btn-dark dropdown-toggle d-flex align-items-center" id="bd-lang" type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Alterar Idioma">
							<svg v-if="$i18n.locale == 'pt'" class="bi my-1"><use href="#brFlag"></use></svg>
							<svg v-if="$i18n.locale == 'en'" class="bi my-1"><use href="#enFlag"></use></svg>
							<span class="d-none ms-2" id="bd-lang-text">Alterar Idioma</span>
						</button>
						<ul id="dropdown-lang" class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-lang-text">
							<li>
								<button type="button" aria-pressed="false" :class="['dropdown-item d-flex align-items-center', { 'active': $i18n.locale == 'pt' }]" @click="changeLocale('pt')">
									<svg class="bi me-2"><use href="#brFlag"></use></svg>
									pt-BR
									<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
								</button>
							</li>
							<li>
								<button type="button" aria-pressed="false" :class="['dropdown-item d-flex align-items-center', { 'active': $i18n.locale == 'en' }]" @click="changeLocale('en')">
									<svg class="bi me-2"><use href="#enFlag"></use></svg>
									en-US
									<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
								</button>
							</li>							
						</ul>
					</div>
						
					<div class="dropdown">
						<button class="btn btn-dark dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Alterar Tema">
							<svg class="bi my-1 theme-icon-active"><use href="#circle-half"></use></svg>
							<span class="d-none ms-2" id="bd-theme-text">{{ $t('app.theme') }}</span>
						</button>
						<ul id="dropdown-theme" class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
							<li>
								<button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
								<svg class="bi me-2 opacity-50"><use href="#sun-fill"></use></svg>
								{{ $t('app.themeLight') }}
								<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
								</button>
							</li>
							<li>
								<button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
								<svg class="bi me-2 opacity-50"><use href="#moon-stars-fill"></use></svg>
								{{ $t('app.themeDark') }}
								<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
								</button>
							</li>
							<li>
								<button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
								<svg class="bi me-2 opacity-50"><use href="#circle-half"></use></svg>
								{{ $t('app.themeAuto') }}
								<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
								</button>
							</li>
						</ul>
					</div>
				</div>

				
				
			</div>

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
				<symbol id="enFlag" viewBox="0 0 32 32">
					<rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"></rect><path d="M1.638,5.846H30.362c-.711-1.108-1.947-1.846-3.362-1.846H5c-1.414,0-2.65,.738-3.362,1.846Z" fill="#a62842"></path><path d="M2.03,7.692c-.008,.103-.03,.202-.03,.308v1.539H31v-1.539c0-.105-.022-.204-.03-.308H2.03Z" fill="#a62842"></path><path fill="#a62842" d="M2 11.385H31V13.231H2z"></path><path fill="#a62842" d="M2 15.077H31V16.923000000000002H2z"></path><path fill="#a62842" d="M1 18.769H31V20.615H1z"></path><path d="M1,24c0,.105,.023,.204,.031,.308H30.969c.008-.103,.031-.202,.031-.308v-1.539H1v1.539Z" fill="#a62842"></path><path d="M30.362,26.154H1.638c.711,1.108,1.947,1.846,3.362,1.846H27c1.414,0,2.65-.738,3.362-1.846Z" fill="#a62842"></path><path d="M5,4h11v12.923H1V8c0-2.208,1.792-4,4-4Z" fill="#102d5e"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path><path fill="#fff" d="M4.601 7.463L5.193 7.033 4.462 7.033 4.236 6.338 4.01 7.033 3.279 7.033 3.87 7.463 3.644 8.158 4.236 7.729 4.827 8.158 4.601 7.463z"></path><path fill="#fff" d="M7.58 7.463L8.172 7.033 7.441 7.033 7.215 6.338 6.989 7.033 6.258 7.033 6.849 7.463 6.623 8.158 7.215 7.729 7.806 8.158 7.58 7.463z"></path><path fill="#fff" d="M10.56 7.463L11.151 7.033 10.42 7.033 10.194 6.338 9.968 7.033 9.237 7.033 9.828 7.463 9.603 8.158 10.194 7.729 10.785 8.158 10.56 7.463z"></path><path fill="#fff" d="M6.066 9.283L6.658 8.854 5.927 8.854 5.701 8.158 5.475 8.854 4.744 8.854 5.335 9.283 5.109 9.979 5.701 9.549 6.292 9.979 6.066 9.283z"></path><path fill="#fff" d="M9.046 9.283L9.637 8.854 8.906 8.854 8.68 8.158 8.454 8.854 7.723 8.854 8.314 9.283 8.089 9.979 8.68 9.549 9.271 9.979 9.046 9.283z"></path><path fill="#fff" d="M12.025 9.283L12.616 8.854 11.885 8.854 11.659 8.158 11.433 8.854 10.702 8.854 11.294 9.283 11.068 9.979 11.659 9.549 12.251 9.979 12.025 9.283z"></path><path fill="#fff" d="M6.066 12.924L6.658 12.494 5.927 12.494 5.701 11.799 5.475 12.494 4.744 12.494 5.335 12.924 5.109 13.619 5.701 13.19 6.292 13.619 6.066 12.924z"></path><path fill="#fff" d="M9.046 12.924L9.637 12.494 8.906 12.494 8.68 11.799 8.454 12.494 7.723 12.494 8.314 12.924 8.089 13.619 8.68 13.19 9.271 13.619 9.046 12.924z"></path><path fill="#fff" d="M12.025 12.924L12.616 12.494 11.885 12.494 11.659 11.799 11.433 12.494 10.702 12.494 11.294 12.924 11.068 13.619 11.659 13.19 12.251 13.619 12.025 12.924z"></path><path fill="#fff" d="M13.539 7.463L14.13 7.033 13.399 7.033 13.173 6.338 12.947 7.033 12.216 7.033 12.808 7.463 12.582 8.158 13.173 7.729 13.765 8.158 13.539 7.463z"></path><path fill="#fff" d="M4.601 11.104L5.193 10.674 4.462 10.674 4.236 9.979 4.01 10.674 3.279 10.674 3.87 11.104 3.644 11.799 4.236 11.369 4.827 11.799 4.601 11.104z"></path><path fill="#fff" d="M7.58 11.104L8.172 10.674 7.441 10.674 7.215 9.979 6.989 10.674 6.258 10.674 6.849 11.104 6.623 11.799 7.215 11.369 7.806 11.799 7.58 11.104z"></path><path fill="#fff" d="M10.56 11.104L11.151 10.674 10.42 10.674 10.194 9.979 9.968 10.674 9.237 10.674 9.828 11.104 9.603 11.799 10.194 11.369 10.785 11.799 10.56 11.104z"></path><path fill="#fff" d="M13.539 11.104L14.13 10.674 13.399 10.674 13.173 9.979 12.947 10.674 12.216 10.674 12.808 11.104 12.582 11.799 13.173 11.369 13.765 11.799 13.539 11.104z"></path><path fill="#fff" d="M4.601 14.744L5.193 14.315 4.462 14.315 4.236 13.619 4.01 14.315 3.279 14.315 3.87 14.744 3.644 15.44 4.236 15.01 4.827 15.44 4.601 14.744z"></path><path fill="#fff" d="M7.58 14.744L8.172 14.315 7.441 14.315 7.215 13.619 6.989 14.315 6.258 14.315 6.849 14.744 6.623 15.44 7.215 15.01 7.806 15.44 7.58 14.744z"></path><path fill="#fff" d="M10.56 14.744L11.151 14.315 10.42 14.315 10.194 13.619 9.968 14.315 9.237 14.315 9.828 14.744 9.603 15.44 10.194 15.01 10.785 15.44 10.56 14.744z"></path><path fill="#fff" d="M13.539 14.744L14.13 14.315 13.399 14.315 13.173 13.619 12.947 14.315 12.216 14.315 12.808 14.744 12.582 15.44 13.173 15.01 13.765 15.44 13.539 14.744z"></path>
				</symbol>
				<symbol id="brFlag" viewBox="0 0 32 32">
					<rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#459a45"></rect><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M3.472,16l12.528,8,12.528-8-12.528-8L3.472,16Z" fill="#fedf00"></path><circle cx="16" cy="16" r="5" fill="#0a2172"></circle><path d="M14,14.5c-.997,0-1.958,.149-2.873,.409-.078,.35-.126,.71-.127,1.083,.944-.315,1.951-.493,2.999-.493,2.524,0,4.816,.996,6.519,2.608,.152-.326,.276-.666,.356-1.026-1.844-1.604-4.245-2.583-6.875-2.583Z" fill="#fff"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
				</symbol>
			</svg>
		</header>	

		<main id="start"  class="flex-grow-1 overflow-hidden position-relative">
			<div class="d-flex flex-row h-100">
				<div v-if="processedData" id="navbarToggleExternalContent" class="menu collapse show overflow-auto shadow z-1">
					<div class="d-flex flex-column h-100">
						<h4 class="p-3 border-bottom bg-body-secondary mb-0">
						{{ $t('app.callExtract') }}
						</h4>
						<div class="px-3">
							<div class="d-flex my-4">
								<img :src="`./img/whatsapp.png`" class="border bg-light rounded" style="width:110px;" />
								<div class="ms-3 align-self-center">
									<h5>
										{{formatPhoneNumber(processedData.requestParams.accountId)}}
										<small class="text-body-secondary fw-light">{{ $t('app.targetPhone') }}</small>
									</h5>

									<ul class="list-unstyled mb-0">
										<li><strong>{{processedData.messageLogs.length}}</strong> {{ $t('app.msgRecords') }}</li>
										<li><strong>{{processedData.callLogs.length}}</strong> {{ $t('app.callRecords') }}</li>
										<li>{{ $t('app.fromTo', { start: formatDate(startDate, "L", selectedTimezone, this.$i18n.locale), end: formatDate(finalDate, "L", selectedTimezone, this.$i18n.locale) }) }}</li>
									</ul>
								</div>
							</div>

							<div v-if="processedIspCount != processedData.ispList?.length" class="alert mb-4 alert-warning" role="alert">
								<div class="spinner-border spinner-border-sm me-3"><span class="visually-hidden">{{ $t('app.loading') }}</span></div>
								<span>{{ $t('app.consultingIps', { count: processedIspCount, total: processedData.ispList?.length }) }}</span>
							</div>

							<div v-if="errorIspCount && processedIspCount == processedData.ispList?.length" class="alert mb-4 alert-danger alert-dismissible fade show" role="alert">
								<i class="text-danger bi bi-x-circle-fill me-3"></i>
								<span>{{ $t('app.consultingIpsError', { count: errorIspCount }) }}</span>
								<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
							</div>

							<div v-if="loadingWaAccount > 0" class="alert mb-4 alert-warning" role="alert">
								<div class="spinner-border spinner-border-sm me-3"><span class="visually-hidden">{{ $t('app.loading') }}</span></div>
								<span>{{ $t('app.consultingWaProfiles', { count: loadedWaAccount, total: processedData.contactList.length }) }}</span>
							</div>

							<div class="mb-3">
								<label for="selectTimezone" class="form-label">{{ $t('app.timezone') }}</label>
								<select v-model="selectedTimezone" class="form-select">
									<option v-for="item in timezoneItens" :value="item.id" :key="item.id">{{ item.text }}</option>
								</select>
							</div>

							<ul class="nav nav-tabs mb-3">
								<li class="nav-item">
									<span class="nav-link active" role="tab">{{ $t('app.menu') }}</span>
								</li>
							</ul>

							<ul class="nav nav-pills flex-column mb-3">
								<li class="nav-item">
									<router-link to="/messages" :class="[$route.name === 'MessagesPage' ? 'nav-link active' : 'nav-link link-body-emphasis']" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#message"></use></svg>
										{{ $t('app.messagesTab') }}
									</router-link>
								</li>
								<li class="nav-item">
									<router-link to="/calls" :class="[$route.name === 'CallsPage' ? 'nav-link active' : 'nav-link link-body-emphasis']" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#call"></use></svg>
										{{ $t('app.callsTab') }}
									</router-link>
								</li>
								<li class="nav-item">
									<router-link to="/charts" :class="[$route.name === 'ChartsPage' ? 'nav-link active' : 'nav-link link-body-emphasis']" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#chart"></use></svg>
										{{ $t('app.chartsTab') }}
									</router-link>
								</li>
								<li class="nav-item">
									<router-link to="/view" :class="[$route.name === 'ViewPage' ? 'nav-link active' : 'nav-link link-body-emphasis']" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#view"></use></svg>
										{{ $t('app.viewTab') }}
									</router-link>
								</li>
							</ul>

							<hr/>

							<ul class="nav nav-pills flex-column mb-3">
								<li class="nav-item">
									<a href="#" class="nav-link link-body-emphasis" aria-current="page" data-bs-toggle="modal" data-bs-target="#apiModal">
										<i class="bi bi-code-square me-2" />
										{{ $t('app.loadApi') }}
									</a>
									<a class="nav-link link-body-emphasis" aria-current="page" 
										:href="jsonData"
										:download="`WA_${processedData.requestParams.accountId}_from_${formatDate(startDate, 'YYYYMMDD', selectedTimezone)}_to_${formatDate(finalDate, 'YYYYMMDD', selectedTimezone)}.json`">
										<i class="bi bi-floppy me-2" />
										{{ $t('app.save') }}
									</a>
									<router-link to="/" class="nav-link link-body-emphasis" aria-current="page">
										<svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#restart"></use></svg>
										{{ $t('app.restart') }}
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

						<p class="text-muted small text-center py-3 mb-0" v-html="$t('app.footer')"></p>
					</div>
				</div>
			</div>
		</main>
	</div>

	<div class="modal fade" id="apiModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">{{ $t('app.modalTitle') }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
					<div class="alert mb-3 alert-info" role="alert">
						<div class="h4 d-flex align-items-center">
							<i class="bi bi-info-circle-fill me-2"></i> 
							<span>{{ $t('app.modalInfoTitle') }}</span>
						</div>
						<p v-html="$t('app.modalInfoText1')"></p>
						<p v-html="$t('app.modalInfoText2')"></p>
					</div>
					<label for="inputApiKey" class="form-label">{{ $t('app.apiKeyLabel') }}</label>
                    <input v-model="apiKey" type="text" class="form-control" id="inputApiKey">
                </div>
                <div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t('app.close') }}</button>
					<button type="button" class="btn btn-primary"  data-bs-dismiss="modal" @click="fetchWaData()">{{ $t('app.consult') }}</button>
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
							if(!this.processedData) break;

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
							console.error('An error occurred while fetching IP data: ', error);
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
							if(!this.processedData) break;

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
							console.error('An error occurred while querying the WhatsApp API: ', error);
						}
					}						
				}
			}            
        }, 
		changeLocale(value) {
			this.$i18n.locale = value;
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

	@media (min-width: 475px) {
		.menu {
			min-width: 475px;
		}
	}

	.menu.collapsing {
		-webkit-transition: none !important;
		transition: none !important;
		display: none !important;
	}
</style>