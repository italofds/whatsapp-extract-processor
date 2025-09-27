<template>
    <div class="flex-fill p-4 pb-0 d-flex flex-column" style="min-height: 0;">
        <h1 class="mb-4 flex-shrink-0">{{ $t('view.title') }}</h1>

        <div v-if="processedWaCount > 0 && processedWaCount < groupedMessages.length" class="alert mb-3 alert-warning" role="alert">
            <div class="spinner-border spinner-border-sm me-3"><span class="visually-hidden">{{ $t('app.loading') }}</span></div>
            <span>{{ $t('view.consultingWaProfiles', { processed: processedWaCount, total: groupedMessages.length }) }}</span>
        </div>
        
        <div class="card rounded-3 shadow-sm d-flex flex-row flex-fill" style="min-height: 0;">

            <div class="border-end rounded-end-0 p-3 bg-body-tertiary rounded-3 d-flex flex-column">
                <button style="border:none;" :title="$t('view.conversationsTab')" :class="['btn btn-outline-secondary btn-lg mb-3', { 'active': activePanel == 'conversations' }]" @click="switchPanel('conversations')">
                    <i class="bi bi-chat-left-text-fill"></i>
                </button>
                <button style="border:none;" :title="$t('view.callsTab')" :class="['btn btn-outline-secondary btn-lg', { 'active': activePanel == 'calls' }]" @click="switchPanel('calls')">
                    <i class="bi bi-telephone-fill"></i>
                </button>
            </div>

            <div v-if="activePanel == 'conversations'" class="d-flex flex-column border-end" style="width: 400px; min-height: 0;">
                <h4 class="p-3">{{ $t('view.conversationsTab') }}</h4>

                <div class="input-group px-3 mb-3">
                    <span class="input-group-text" id="basic-addon1"><svg class="bi"><use href="#search"></use></svg></span>
                    <input v-model="chatFilter" type="text" class="form-control" :placeholder="$t('view.searchConversations')" :aria-label="$t('view.searchConversations')" >
                </div>

                <div class="px-3 mb-3">
                    <input type="radio" class="btn-check" name="radioFilter" id="btnradioall" value="" v-model="chatTypeFilter" >
                    <label class="btn btn-sm btn-outline-secondary rounded-pill me-2" for="btnradioall">{{ $t('view.all') }}</label>

                    <input type="radio" class="btn-check" name="radioFilter" id="btnradioindividual" value="individual" v-model="chatTypeFilter">
                    <label class="btn btn-sm btn-outline-secondary rounded-pill me-2" for="btnradioindividual">{{ $t('view.contacts') }}</label>

                    <input type="radio" class="btn-check" name="radioFilter" id="btnradiogroup" value="group" v-model="chatTypeFilter">
                    <label class="btn btn-sm btn-outline-secondary rounded-pill" for="btnradiogroup">{{ $t('view.groups') }}</label>
                </div>

                <div class="flex-grow-1 overflow-auto" style="min-height: 0;">
                    <div class="list-group list-group-flush">
                        <div v-for="(conversation, index) in filteredMessages" 
                            role="button"
                            :key="index" 
                            :class="['list-group-item list-group-item-action d-flex flex-row p-3', { 'bg-body-secondary': conversation.id == activeTarget?.id }]" 
                            @click="selectTarget(conversation)">
                            <div data-bs-toggle="modal" data-bs-target="#profileModal" role="button" @click="selectActiveContact(conversation.id)">
                                <svg v-if="!getProfilePic(conversation.id)" class="bi thumbnail-picture me-2"><use :href="'#' + conversation.msgStyle"></use></svg>
                                <img v-if="getProfilePic(conversation.id)" class="thumbnail-picture me-2" :src="getProfilePic(conversation.id)" />
                            </div>                            
                            <div class="flex-fill align-self-center d-flex flex-column">
                                <span class="conversation-id">{{ printId(conversation) }}</span>
                                <div class="text-muted d-flex flex-row">
                                    <svg v-if="isSended(getLastMessage(conversation))" class="small align-self-center bi type-icon me-1"><use href="#check"></use></svg>
                                    <svg v-if="getLastMessage(conversation).type != 'text'" class="small align-self-center bi type-icon me-1"><use :href="'#' + getLastMessage(conversation).type"></use></svg>
                                    <small>{{ getMessageType(getLastMessage(conversation)) }}</small>
                                </div>
                            </div>
                            <div class="d-flex flex-column text-muted text-center align-self-center">
                                <small>{{ formatDate(getLastMessage(conversation).timestamp, "L", selectedTimezone, this.$i18n.locale) }}</small>
                                <small>{{ formatDate(getLastMessage(conversation).timestamp, "LTS", selectedTimezone, this.$i18n.locale) }}</small>
                            </div>                           
                        </div>
                    </div>                    
                </div>
            </div>

            <div v-if="activePanel == 'calls'" class="d-flex flex-column border-end" style="width: 400px; min-height: 0;">
                <h4 class="p-3">{{ $t('view.callsTab') }}</h4>

                <div class="input-group px-3 mb-3">
                    <span class="input-group-text" id="basic-addon1"><svg class="bi"><use href="#search"></use></svg></span>
                    <input v-model="callFilter" type="text" class="form-control" :placeholder="$t('view.searchCalls')" :aria-label="$t('view.searchCalls')" >
                </div>

                <div class="flex-grow-1 overflow-auto" style="min-height: 0;">
                    <div class="list-group list-group-flush">
                        <div v-for="(groupedCall, index) in filteredCalls" 
                            role="button"
                            :key="index" 
                            :class="['list-group-item list-group-item-action d-flex flex-row p-3', { 'bg-body-secondary': groupedCall.calls[0].callId == activeTarget?.calls[0].callId }]"
                            @click="selectTarget(groupedCall)">
                            <div data-bs-toggle="modal" data-bs-target="#profileModal" role="button" @click="selectActiveContact(groupedCall.interlocutor)">
                                <svg v-if="!getProfilePic(groupedCall.interlocutor)" class="bi thumbnail-picture me-2"><use href="#individual"></use></svg>
                                <img v-if="getProfilePic(groupedCall.interlocutor)" class="thumbnail-picture me-2" :src="getProfilePic(groupedCall.interlocutor)" />
                            </div>                           
                            <div class="flex-fill align-self-center d-flex flex-column">
                                <div :class="['conversation-id', {'text-danger': !groupedCall.calls[0].answered && groupedCall.calls[0].direction == 'incoming' }]">
                                    <span>{{ printId({'msgStyle': 'individual','id': groupedCall.interlocutor}) }}</span>
                                    <small v-if="groupedCall.calls.length > 1"> ({{ groupedCall.calls.length }})</small>
                                </div>
                                <div class="text-muted d-flex flex-row">
                                    <i v-if="groupedCall.calls[0].direction == 'outgoing'" class="bi bi-arrow-up-right me-1 text-success"></i>
                                    <i v-if="groupedCall.calls[0].direction == 'incoming'" :class="['bi bi-arrow-down-left me-1 text-success', {'text-danger': !groupedCall.calls[0].answered}]"></i>
                                    <small>{{ formatDate(groupedCall.calls[0].timestamp, "LL, LTS", selectedTimezone, this.$i18n.locale) }}</small>
                                </div>                                
                            </div>   
                            <div class="text-muted text-center align-self-center">
                                <i v-if="groupedCall.calls[0].callEvents[0].mediaType == 'audio'" class="bi bi-telephone h4 align-self-center"></i>
                                <i v-if="groupedCall.calls[0].callEvents[0].mediaType == 'video'" class="bi bi-camera-video h4 align-self-center"></i>
                            </div>                    
                        </div>     
                    </div>                                  
                </div>
            </div>

            <div v-if="activeTarget && activePanel == 'conversations'" class="flex-fill d-flex flex-column border-end" style="min-height: 0;">
                <div class="bg-body-secondary p-3 d-flex flex-row border-bottom rounded-3 rounded-start-0 rounded-bottom-0">
                    <div data-bs-toggle="modal" data-bs-target="#profileModal" role="button" @click="selectActiveContact(activeTarget.id)">
                        <svg v-if="!getProfilePic(activeTarget.id)" class="bi thumbnail-picture me-2"><use :href="'#' + activeTarget.msgStyle"></use></svg>                     
                        <img v-if="getProfilePic(activeTarget.id)" class="thumbnail-picture me-2" :src="getProfilePic(activeTarget.id)" />
                    </div>                    
                    <span class=" align-self-center">{{ printId(activeTarget) }}</span>
                </div>
                <div id="targetDiv" class="flex-grow-1 overflow-auto p-3 bg-body-tertiary" style="min-height: 0;">
                    <section v-for="(msgsGroup, index) in getItensByDate(activeTarget.messages)" :key="index">
                        <div class="mb-3 d-flex justify-content-center position-sticky z-3" style="top:0;">
                            <small class="badge rounded-pill bg-body text-body">
                                {{ msgsGroup.date }}
                            </small>
                        </div>

                        <div v-for="(message, index) in msgsGroup.itens" 
                            :key="index"
                            :class="isSended(message) ? 'text-end' : ''">
                            <div :class="['rounded-bottom-2 p-2 d-inline-block m-2 position-relative text-start', {'message-received rounded-end-2 bg-warning-subtle': !isSended(message) }, {'message-sended bg-success-subtle rounded-start-2': isSended(message) }]">
                            <div v-if="message.type == 'video'" class="video-placeholder d-flex justify-content-center align-items-center mb-2"> 
                                    <i class="text-white h1 bi bi-play-circle"></i>
                                </div>
                                <div v-if="message.type == 'image'" class="image-placeholder d-flex justify-content-center align-items-center mb-2"> 
                                    <i class="text-white h1 bi bi-image-alt"></i>
                                </div>
                                <p>
                                    <svg v-if="message.type == 'voice'" class="bi" style="font-size:130%"><use href="#voice"></use></svg>
                                    <svg v-if="message.type == 'sticker'" class="bi"><use href="#sticker"></use></svg>
                                    <svg v-if="message.type == 'document'" class="bi" style="font-size:130%"><use href="#document"></use></svg>
                                    {{ getMessageType(message) + " (" + message.msgSize + " bytes)" }}
                                </p>
                                <hr/>
                                <div class="text-end w-100">
                                    <small class="text-muted" style="font-size: 75%;">{{ message.senderDevice }}</small>
                                </div>
                                <div v-if="message.ip" class="text-end w-100">
                                    <small class="text-muted" style="font-size: 75%;">{{ message.ip + "/" + message.port }}</small>
                                </div>
                                <div v-if="message.ispIndex && ispList" class="text-end w-100">
                                    <small class="text-muted" style="font-size: 75%;">{{ ispList?.[message.ispIndex].isp }}</small>
                                </div>                            
                                <div class="text-end w-100">
                                    <small class="text-muted fw-bold" style="font-size: 75%;">{{ formatDate(message.timestamp, "LTS", selectedTimezone, this.$i18n.locale) }}</small>
                                </div>
                            </div>                        
                        </div>
                    </section>  
                    
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="badge rounded-pill bg-body text-body">{{ $t('view.endMarker') }}</div>
                    </div>
                </div>
            </div>

            <div v-if="activeTarget && activePanel == 'calls'" class="flex-fill d-flex flex-column border-end" style="min-height: 0;">
                <div class="bg-body-secondary p-3 d-flex flex-row border-bottom rounded-3 rounded-start-0 rounded-bottom-0">
                    <div data-bs-toggle="modal" data-bs-target="#profileModal" role="button" @click="selectActiveContact(activeTarget.interlocutor)">
                        <svg v-if="!getProfilePic(activeTarget.interlocutor)" class="bi thumbnail-picture me-2"><use href="#individual"></use></svg>
                        <img v-if="getProfilePic(activeTarget.interlocutor)" class="thumbnail-picture me-2" :src="getProfilePic(activeTarget.interlocutor)" />
                    </div>                    
                    <span class=" align-self-center">{{ printId({'msgStyle': 'individual','id': activeTarget.interlocutor}) }}</span>
                </div>
                <div class="flex-grow-1 overflow-auto p-3 bg-body-tertiary" style="min-height: 0;">
                    <section v-for="(callGroup, index) in getItensByDate(activeTarget.calls)" :key="index">
                        <div class="mb-3 d-flex justify-content-center position-sticky z-3" style="top:0;">
                            <small class="badge rounded-pill bg-body text-body">
                                {{ callGroup.date }}
                            </small>
                        </div>

                        <ul class="list-group rounded-3 mb-3">
                            <li v-for="(call, index1) in callGroup.itens" 
                                :key="index1" class="list-group-item d-flex flex-column p-0">

                                <div class="rounded-3 list-group-item-action p-3 d-flex flex-row" data-bs-toggle="collapse" :href="'#call_' + call.callId" role="button" aria-expanded="false">
                                    <i v-if="call.direction == 'outgoing'" class="bi bi-arrow-up-right me-2 text-success h4 align-self-center"></i>
                                    <i v-if="call.direction == 'incoming'" :class="['bi bi-arrow-down-left me-2 text-success h4 align-self-center', {'text-danger': !call.answered}]"></i>
                                    
                                    <div class="flex-fill align-self-center d-flex flex-column">
                                        <span v-if="call.direction == 'outgoing'">{{ $t('view.callMade') }}</span>
                                        <span v-if="call.direction == 'incoming' && call.answered">{{ $t('view.callReceived') }}</span>
                                        <span v-if="call.direction == 'incoming' && !call.answered">{{ $t('view.callMissed') }}</span>
                                        <div class="text-muted d-flex flex-row">
                                            <i v-if="call.callEvents[0].mediaType == 'audio'" class="bi bi-telephone me-1"></i>
                                            <i v-if="call.callEvents[0].mediaType == 'video'" class="bi bi-camera-video me-1"></i>                            
                                            <small>{{ formatDate(call.timestamp, "LTS", selectedTimezone, this.$i18n.locale) }}</small>
                                        </div>
                                    </div>

                                    <div class="d-flex flex-column text-muted text-end align-self-center">
                                        <small v-if="call.talkTime > 0" :title="$t('view.talkTime')">{{ convertSeconds(call.talkTime) }}</small>
                                        <small v-if="call.talkTime == 0 && getTerminatonType(call.callEvents) == 'rejected'" >{{ $t('view.callRejected') }}</small>
                                        <small v-if="call.talkTime == 0 && getTerminatonType(call.callEvents) == 'not-answered'" >{{ $t('view.callNotAnswered') }}</small>
                                        <small :title="$t('view.totalCallTime')">{{ convertSeconds(call.totalTime) }}</small>
                                    </div>
                                </div>

                                <div class="collapse" :id="'call_' + call.callId" :key="'call_' + call.callId">
                                    <div class="mx-3 border-top">
                                        <ul class="timeline">
                                            <li v-for="(event, index2) in call.callEvents" :key="index2">
                                                <span target="_blank" href="#"><strong>{{ $t('view.event') }}:</strong> {{ event.type }}</span>
                                                <small class='float-end' :title="$t('view.eventTime')">{{ formatDate(event.timestamp, "LTS", selectedTimezone, this.$i18n.locale) }}</small>
                                                <small class="mb-3 text-muted">
                                                    <div :title="$t('view.origin')">{{ formatPhoneNumber(event.from) }}</div>
                                                    <div v-if="event.ip" :title="$t('view.ipPort')">{{ event.ip + "/" + event.port  }}</div>
                                                    <div v-if="ispList && event.ispIndex" :title="$t('view.provider')">{{ printValue(ispList?.[event.ispIndex].isp)  }}</div>
                                                </small>                                                
                                            </li>
                                        </ul>
                                    </div>                                    
                                </div>                                
                            </li>
                        </ul>                       
                    </section>
                </div>
            </div>

            <div v-if="!activeTarget" class="bg-body-tertiary flex-fill d-flex justify-content-center align-items-center rounded-3 rounded-start-0">
                <small class="text-muted">{{ $t('view.navigateToSee') }}</small>
            </div>
        </div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="individual" viewBox="0 0 212 212">
            <path fill="#DFE5E7" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g><path fill="#FFFFFF" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path></g>
        </symbol>
        <symbol id="group" viewBox="0 0 212 212">
            <path d="M105.946 0.25C164.318 0.25 211.64 47.596 211.64 106C211.64 164.404 164.318 211.75 105.945 211.75C47.571 211.75 0.25 164.404 0.25 106C0.25 47.596 47.571 0.25 105.946 0.25Z" fill="#DFE5E7"></path><path fill="#FFFFFF" fill-rule="evenodd" clip-rule="evenodd" d="M102.282 77.2856C102.282 87.957 93.8569 96.5713 83.3419 96.5713C72.827 96.5713 64.339 87.957 64.339 77.2856C64.339 66.6143 72.827 58 83.3419 58C93.8569 58 102.282 66.6143 102.282 77.2856ZM150.35 80.1427C150.35 89.9446 142.612 97.857 132.954 97.857C123.296 97.857 115.5 89.9446 115.5 80.1427C115.5 70.3409 123.296 62.4285 132.954 62.4285C142.612 62.4285 150.35 70.3409 150.35 80.1427ZM83.3402 109.428C68.5812 109.428 39 116.95 39 131.928V143.714C39 147.25 41.8504 148 45.3343 148H121.346C124.83 148 127.68 147.25 127.68 143.714V131.928C127.68 116.95 98.0991 109.428 83.3402 109.428ZM126.804 110.853C127.707 110.871 128.485 110.886 129 110.886C143.759 110.886 174 116.95 174 131.929V141.571C174 145.107 171.15 148 167.666 148H134.854C135.551 146.007 135.995 143.821 135.995 141.571L135.75 131.071C135.75 121.51 130.136 117.858 124.162 113.971C122.772 113.067 121.363 112.15 120 111.143C119.981 111.123 119.962 111.098 119.941 111.07C119.893 111.007 119.835 110.931 119.747 110.886C121.343 110.747 124.485 110.808 126.804 110.853Z"></path>
        </symbol>
        <symbol id="video" viewBox="0 0 16 20">
            <path fill="currentColor" d="M15.243,5.868l-3.48,3.091v-2.27c0-0.657-0.532-1.189-1.189-1.189H1.945 c-0.657,0-1.189,0.532-1.189,1.189v7.138c0,0.657,0.532,1.189,1.189,1.189h8.629c0.657,0,1.189-0.532,1.189-1.189v-2.299l3.48,3.09 V5.868z"></path>
        </symbol>
        <symbol id="image" viewBox="0 0 16 20">
            <path fill="currentColor" d="M13.822,4.668H7.14l-1.068-1.09C5.922,3.425,5.624,3.3,5.409,3.3H3.531 c-0.214,0-0.51,0.128-0.656,0.285L1.276,5.296C1.13,5.453,1.01,5.756,1.01,5.971v1.06c0,0.001-0.001,0.002-0.001,0.003v6.983 c0,0.646,0.524,1.17,1.17,1.17h11.643c0.646,0,1.17-0.524,1.17-1.17v-8.18C14.992,5.191,14.468,4.668,13.822,4.668z M7.84,13.298 c-1.875,0-3.395-1.52-3.395-3.396c0-1.875,1.52-3.395,3.395-3.395s3.396,1.52,3.396,3.395C11.236,11.778,9.716,13.298,7.84,13.298z  M7.84,7.511c-1.321,0-2.392,1.071-2.392,2.392s1.071,2.392,2.392,2.392s2.392-1.071,2.392-2.392S9.161,7.511,7.84,7.511z"></path>
        </symbol>
        <symbol id="sticker" viewBox="0 0 16 16">
            <path fill="currentColor" d="M9.179,14.637c0.061-0.14,0.106-0.29,0.135-0.45 c0.031-0.171,0.044-0.338,0.049-0.543c0.002-0.078,0.003-0.155,0.003-0.233c0-0.043,0-0.043,0.001-0.067c0-0.024,0-0.024,0-0.072 l0.002-0.216c0.01-0.364,0.032-1.205,0.08-1.473c0.052-0.287,0.136-0.538,0.255-0.771c0.122-0.237,0.281-0.453,0.472-0.642 c0.193-0.191,0.412-0.349,0.653-0.469c0.238-0.12,0.493-0.203,0.786-0.255c0.27-0.048,1.098-0.07,1.487-0.08l0.152,0.001 c0.027,0,0.027,0,0.047,0c0.045,0,0.088-0.001,0.325-0.004c0.221-0.006,0.384-0.018,0.554-0.048 c0.177-0.032,0.341-0.081,0.494-0.151c-0.201,0.923-0.671,1.77-1.359,2.429c-0.561,0.538-1.264,1.194-2.057,1.924 C10.667,14.061,9.951,14.444,9.179,14.637z M7.358,14.797c-0.203,0.005-0.406,0.01-0.474,0.012c-0.301,0.007-0.448,0.01-0.507,0.009 c-0.551-0.015-0.96-0.046-1.372-0.119c-0.481-0.086-0.912-0.226-1.314-0.428c-0.416-0.209-0.794-0.48-1.123-0.807 c-0.33-0.326-0.605-0.699-0.816-1.11c-0.205-0.397-0.347-0.824-0.434-1.303c-0.074-0.411-0.106-0.827-0.12-1.356 C1.193,9.5,1.19,9.297,1.189,9.078c-0.002-0.206-0.002-0.37-0.002-0.736V7.668c0-0.274,0-0.396,0.001-0.549 c0-0.064,0.001-0.125,0.001-0.182c0.001-0.223,0.004-0.426,0.009-0.62c0.014-0.529,0.046-0.946,0.121-1.358 c0.087-0.476,0.229-0.903,0.434-1.301c0.211-0.411,0.485-0.784,0.814-1.109c0.33-0.327,0.708-0.599,1.122-0.807 c0.403-0.203,0.834-0.344,1.315-0.429c0.413-0.074,0.822-0.105,1.379-0.12c0.72-0.009,0.989-0.011,1.359-0.011H8.27 c0.896,0.003,1.143,0.005,1.366,0.011c0.55,0.015,0.959,0.046,1.371,0.12c0.482,0.085,0.913,0.226,1.314,0.428 c0.416,0.209,0.794,0.48,1.123,0.806c0.331,0.327,0.605,0.7,0.814,1.109c0.206,0.4,0.348,0.827,0.434,1.302 c0.075,0.412,0.107,0.819,0.121,1.356c0.006,0.198,0.009,0.402,0.01,0.619c0,0.008,0,0.016,0,0.024c0,0.069-0.001,0.132-0.003,0.194 c-0.004,0.162-0.014,0.283-0.033,0.391c-0.019,0.106-0.05,0.197-0.092,0.28c-0.044,0.085-0.1,0.162-0.168,0.229 c-0.069,0.069-0.148,0.125-0.234,0.168s-0.179,0.074-0.29,0.094c-0.108,0.019-0.227,0.028-0.395,0.033 c-0.231,0.003-0.27,0.003-0.311,0.004c-0.018,0-0.018,0-0.039,0l-0.163-0.001c-0.453,0.012-1.325,0.036-1.656,0.096 c-0.388,0.069-0.737,0.183-1.064,0.348c-0.336,0.168-0.643,0.389-0.911,0.655c-0.267,0.263-0.49,0.566-0.661,0.899 c-0.166,0.324-0.281,0.67-0.351,1.054c-0.06,0.33-0.085,1.216-0.096,1.636l-0.002,0.23c0,0.052,0,0.052,0,0.069 c0,0.019,0,0.019-0.001,0.067c0,0.074-0.001,0.143-0.003,0.213c-0.004,0.158-0.014,0.28-0.033,0.388 c-0.02,0.106-0.05,0.197-0.092,0.279c-0.044,0.085-0.1,0.162-0.168,0.229c-0.069,0.069-0.148,0.125-0.234,0.168 c-0.086,0.043-0.179,0.073-0.289,0.093C7.478,14.785,7.421,14.792,7.358,14.797z"></path>
        </symbol>
        <symbol id="voice" viewBox="0 0 12 20">
            <path fill="currentColor" d="M6,11.745c1.105,0,2-0.896,2-2V4.941c0-1.105-0.896-2-2-2s-2,0.896-2,2v4.803 C4,10.849,4.895,11.745,6,11.745z M9.495,9.744c0,1.927-1.568,3.495-3.495,3.495s-3.495-1.568-3.495-3.495H1.11 c0,2.458,1.828,4.477,4.192,4.819v2.495h1.395v-2.495c2.364-0.342,4.193-2.362,4.193-4.82H9.495V9.744z"></path>
        </symbol>
        <symbol id="check" viewBox="0 0 18 18">
            <path fill="currentColor" d="M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z"></path>
        </symbol>
        <symbol id="reaction" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9.153,11.603c0.795,0,1.439-0.879,1.439-1.962S9.948,7.679,9.153,7.679 S7.714,8.558,7.714,9.641S8.358,11.603,9.153,11.603z M5.949,12.965c-0.026-0.307-0.131,5.218,6.063,5.551 c6.066-0.25,6.066-5.551,6.066-5.551C12,14.381,5.949,12.965,5.949,12.965z M17.312,14.073c0,0-0.669,1.959-5.051,1.959 c-3.505,0-5.388-1.164-5.607-1.959C6.654,14.073,12.566,15.128,17.312,14.073z M11.804,1.011c-6.195,0-10.826,5.022-10.826,11.217 s4.826,10.761,11.021,10.761S23.02,18.423,23.02,12.228C23.021,6.033,17.999,1.011,11.804,1.011z M12,21.354 c-5.273,0-9.381-3.886-9.381-9.159s3.942-9.548,9.215-9.548s9.548,4.275,9.548,9.548C21.381,17.467,17.273,21.354,12,21.354z  M15.108,11.603c0.795,0,1.439-0.879,1.439-1.962s-0.644-1.962-1.439-1.962s-1.439,0.879-1.439,1.962S14.313,11.603,15.108,11.603z"></path>
        </symbol>
        <symbol id="document" viewBox="0 0 13 20">
            <path fill="currentColor" d="M10.2,3H2.5C1.7,3,1,3.7,1,4.5v10.1C1,15.3,1.7,16,2.5,16h7.7c0.8,0,1.5-0.7,1.5-1.5v-10 C11.6,3.7,11,3,10.2,3z M7.6,12.7H3.5v-1.3h4.1V12.7z M9.3,10H3.5V8.7h5.8V10z M9.3,7.3H3.5V6h5.8V7.3z"></path>
        </symbol>
        <symbol id="search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </symbol>
    </svg>

    <div class="modal fade" id="profileModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{ $t('view.profile') }} <span v-if="getContact(activeContact)?.isBusiness">{{ $t('view.business') }}</span></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-body-tertiary">
                    <div class="card shadow-sm mb-3">
                        <div class="card-body">
                            <div v-if="!getProfilePic(activeContact)" class="details-picture mb-2">
                                <svg class="bi w-100 h-100"><use href="#individual"></use></svg>
                            </div>
                            <img v-if="getProfilePic(activeContact)" class="w-100 mb-2" :src="getProfilePic(activeContact)" />
                            <h4 class="text-center">
                                <div>{{ formatPhoneNumber(activeContact) }}</div>
                                <small v-if="!isNameEditable" class="text-muted">{{ newName ? newName : $t('view.noName') }}</small>
                            </h4>
                            <input v-if="isNameEditable" class="form-control text-center" v-model="newName" :placeholder="$t('view.contactName')" />
                        </div>
                    </div>

                    <div v-if="getContact(activeContact)?.about" class="card shadow-sm mb-3">
                        <div class="card-body">
                            <label class="form-label">{{ $t('view.about') }}</label>
                            <div>{{ getContact(activeContact)?.about }}</div>
                        </div>
                    </div>
                    
                    <div v-if="getContact(activeContact)?.description" class="card shadow-sm mb-3">
                        <div class="card-body">
                            <label class="form-label">{{ $t('view.description') }}</label>
                            <div>{{ getContact(activeContact)?.description }}</div>
                        </div>
                    </div> 
                </div>
                <div class="modal-footer">
                    <button v-if="isNameEditable" class="btn btn-outline-secondary" @click="setNameEditable(false)">{{ $t('view.cancel') }}</button>
                    <button v-if="isNameEditable" class="btn btn-primary" @click="saveContact()" >{{ $t('view.save') }}</button>
                    <button v-if="!isNameEditable" class="btn btn-primary" @click="setNameEditable(true)">{{ $t('view.edit') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {formatPhoneNumber, formatDate} from '@/utils/utils'

export default {    
    name: 'ViewPage',
    components: {
	},
    props: {
        processedData: {
            type: Object,
            required: true
        },
        selectedTimezone: {
            type: Number,
            required: true
        },
    },
    mounted() {
        if(!this.processedData) {
            this.$router.push('/');
        }
    },
    data() {
        return {
            newName: null,
            isNameEditable: false,
            activeContact: null,
            activeTarget: null,
            activePanel: 'conversations',
            apiKey: null,
            processedWaCount: 0,
            chatFilter: '',
            chatTypeFilter: '',
            callFilter: ''
        }
    },
    computed: {
        filteredMessages: function() {
            var resultMessages = this.groupedMessages;

            if(this.chatFilter) {
                resultMessages = this.groupedMessages.filter(item => item.id.includes(this.chatFilter));
            }

            if(this.chatTypeFilter) {
                resultMessages = this.groupedMessages.filter(item => item.msgStyle == this.chatTypeFilter);
            }
            
            return resultMessages;
        },
        filteredCalls: function() {
            var resultCalls = this.groupedCalls;

            if(this.callFilter) {
                resultCalls = this.groupedCalls.filter(item => item.interlocutor.includes(this.callFilter));
            }
            
            return resultCalls;
        },
        groupedMessages: function() {
            if(this.processedData) {                
                const groups = {};    
                var targetNumber = this.processedData.requestParams.accountId;
                            
                this.processedData.messageLogs.forEach(msg => {
                    let id;
                    let msgStyle = msg.msgStyle;
                    
                    if (msgStyle === "individual") {
                        if (msg.sender === targetNumber) {
                            id = msg.recipients;
                        } else if (msg.recipients === targetNumber) {
                            id = msg.sender;
                        } else {
                            return;
                        }
                    } else if (msgStyle === "group") {
                        id = msg.groupId;
                    } else {
                        return;
                    }
                    
                    const key = `${msgStyle}-${id}`;
                    
                    if (!groups[key]) {
                        groups[key] = {
                            id: id,
                            msgStyle: msgStyle,
                            messages: []
                        };
                    }
                    
                    groups[key].messages.push(msg);
                });
                
                const groupedMessagesArray = Object.values(groups).sort((a, b) => {
                    const lastMessageA = a.messages[a.messages.length - 1].timestamp;
                    const lastMessageB = b.messages[b.messages.length - 1].timestamp;
                    return new Date(lastMessageB) - new Date(lastMessageA);
                });

                return groupedMessagesArray;

            }
            return null;
        },
        groupedCalls: function() {
            if(this.processedData && this.processedData.callLogs) {         
                var calls = this.processedData.callLogs;
                var target = this.processedData.requestParams.accountId;

                var processedCalls = calls.map(call => processCall(call, target)).filter(call => call != null);
                
                // Sort the calls from most recent to oldest
                processedCalls.sort((a, b) => b.timestamp - a.timestamp);
                
                // Group calls to/from the same interlocutor that were made in sequence
                var groupedCalls = [];
                var currentGroup = null;
                
                for (var i = 0; i < processedCalls.length; i++) {
                    var call = processedCalls[i];
                    if (currentGroup == null) {
                        // Start a new group
                        currentGroup = {
                            interlocutor: call.interlocutor,
                            calls: [call]
                        };
                        groupedCalls.push(currentGroup);
                    } else {
                        // Check if the interlocutor is the same as the current group
                        if (call.interlocutor === currentGroup.interlocutor) {
                            // Add call to current group
                            currentGroup.calls.push(call);
                        } else {
                            // Start a new group
                            currentGroup = {
                                interlocutor: call.interlocutor,
                                calls: [call]
                            };
                            groupedCalls.push(currentGroup);
                        }
                    }
                }
                
                return groupedCalls;
            }
            return null;
        },
        ispList: function() {
            if(this.processedData) {
                return this.processedData.ispList;
            }
            return null;
        },
    },
    methods: {
        formatPhoneNumber,
		formatDate,
        printId(conversation) {
            if(conversation) {
                if(conversation.msgStyle == 'group') {
                    return this.$t('app.group') + " " + conversation.id;
                } else {
                    var contactName = this.getContact(conversation.id)?.name;
                    if(contactName) {
                        return contactName;
                    } else {
                        return this.formatPhoneNumber(conversation.id);
                    }                    
                }
            } else {
                return "";
            }
           
        },
        printValue(value) {
			return value ? value.substring(0, 32767) : "-";
		},
        getLastMessage(conversation) {
            return conversation.messages[conversation.messages.length-1];
        },
        getMessageType(message) {
            if(message.type == 'text') {
                return this.$t('view.textMessage');

            } else if(message.type == 'voice') {
                return this.$t('view.voiceMessage');

            } else if(message.type == 'video') {
                return this.$t('view.videoMessage');

            } else if(message.type == 'sticker') {
                return this.$t('view.stickerMessage');

            } else if(message.type == 'image') {
                return this.$t('view.imageMessage');

            } else if(message.type == 'document') {
                return this.$t('view.documentMessage');

            } else if(message.type == 'reaction') {
                return this.$t('view.reactionMessage');

            } else {
                return this.$t('view.unknownMessage');
            }
        },
        isSended(message) {
            return message.sender == this.processedData.requestParams.accountId;
        },
        selectTarget(target) {
            this.activeTarget = target;

            this.$nextTick(() => {
                const targetDiv = document.getElementById('targetDiv');
                if(targetDiv) {
                    targetDiv.scrollTop = targetDiv.scrollHeight;
                }
            });
        },
        selectActiveContact(id) {
            this.activeContact = id;
            this.isNameEditable = false;
            this.newName = this.getContact(this.activeContact)?.name;
        },
        getItensByDate(itemList){
            if(itemList) {
                const groupedItens = {};

                itemList.forEach(item => {
                    let date = formatDate(item.timestamp, "L", this.selectedTimezone, this.$i18n.locale);
                    if (!groupedItens[date]) {
                        groupedItens[date] = [];
                    }
                    groupedItens[date].push(item);
                });

                return Object.keys(groupedItens).map(date => {
                    return {
                        date: date,
                        itens: groupedItens[date]
                    };
                });
            }
        },
        getContact(id) {
            if(this.processedData?.contactList) {
                for(let contact of this.processedData.contactList) {
                    if(contact.accountId == id) {
                        return contact;
                    }
                }
            }

            return null;
        },
        getProfilePic(id) {
            const contact = this.getContact(id);
            if(contact && contact.profilePic) {
                return contact.profilePic;
            }

            return null;
        },
        switchPanel(panel) {
            this.activePanel = panel;
            this.activeTarget = null;
        },
        convertSeconds(value) {
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            const seconds = value % 60;

            const formatedHours = String(hours).padStart(2, '0');
            const formatedMinutes = String(minutes).padStart(2, '0');
            const formatedSeconds = String(seconds).padStart(2, '0');

            return `${formatedHours}:${formatedMinutes}:${formatedSeconds}`;
        },
        getTerminatonType(events) {
            if(events && events.length == 2 && events[0].to != events[1].to) {
                return 'rejected';
            }

            return 'not-answered';
        },
        setNameEditable(value) {
            this.isNameEditable = value;
            this.newName = this.getContact(this.activeContact)?.name;
        },
        saveContact() {
            this.getContact(this.activeContact).name = this.newName;
            this.isNameEditable = false;
        }
    },
};

function processCall(call, target) {
    // Find first event
    var firstEvent = call.events[0];
    
    // Determine direction and interlocutor
    var direction;
    var interlocutor;
    if (firstEvent.from === target) {
        // Target originated the call
        direction = 'outgoing';
        interlocutor = firstEvent.to;
    } else if (firstEvent.to === target) {
        // Target received the call
        direction = 'incoming';
        interlocutor = firstEvent.from;
    } else {
        // Neither from nor to is the target, skip this call
        return null;
    }
    
    // Determine if the call was answered
    var acceptEvent = call.events.find(event => event.type === 'accept');
    var answered = acceptEvent ? true : false;
    
    // Find the earliest "offer" timestamp
    var offerTime = new Date(firstEvent.timestamp);
    
    // Find the latest "terminate" timestamp
    var terminateEvents = call.events.filter(event => event.type === 'terminate');
    var terminateTime;
    if (terminateEvents.length > 0) {
        terminateTime = terminateEvents.reduce((latest, event) => {
            var eventTime = new Date(event.timestamp);
            return eventTime > latest ? eventTime : latest;
        }, new Date(0));
    } else {
        // No terminate event, set terminateTime to offerTime
        terminateTime = offerTime;
    }
    
    // Calculate total time
    var totalTime = (terminateTime - offerTime) / 1000; // in seconds
    
    // Calculate talk time
    var talkTime = 0;
    if (answered) {
        var acceptTime = new Date(acceptEvent.timestamp);
        talkTime = (terminateTime - acceptTime) / 1000; // in seconds
    }
    
    // Build processed call object
    var processedCall = {
        callId: call.callId,
        interlocutor: interlocutor,
        direction: direction,
        answered: answered,
        totalTime: totalTime,
        talkTime: talkTime,
        timestamp: offerTime,
        endTime: terminateTime,
        callEvents: call.events
    };
    
    return processedCall;
}
</script>

<style>
    .conversation-id {
        display: block;
        width: 200px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .thumbnail-picture {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .details-picture {
        width: 100%;
        aspect-ratio: 1/1;
        background: #DFE5E7;
    }
    .type-icon {
        width: 1.25em;
        height: 1.25em;
    }
    .message-received::before {
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 0px 5px 10px;
        border-color: var(--bs-warning-bg-subtle) transparent transparent transparent;
    }
    .message-sended::before {
        content: "";
        position: absolute;
        top: 0;
        right: -10px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 10px 10px 0px;
        border-color: var(--bs-success-bg-subtle) transparent transparent transparent;
    }
    .message-sended,
    .message-received {
        max-width: 300px;
    }

    .video-placeholder {
        aspect-ratio: 3/2;
        background-color: #333;
    }
    .image-placeholder {
        aspect-ratio: 1/1;
        background-color: #CCC;
    }

    .video-placeholder,
    .image-placeholder {
        min-width: 250px;
        width: 100%;
    }

    ul.timeline {
        list-style-type: none;
        position: relative;
    }
    ul.timeline:before {
        content: ' ';
        background: #d4d9df;
        display: inline-block;
        position: absolute;
        left: 29px;
        width: 2px;
        height: 100%;
        z-index: 400;
        margin-top: 5px;
    }
    ul.timeline > li {
        margin: 20px 0;
        padding-left: 20px;
    }
    ul.timeline > li:before {
        content: ' ';
        background: var(--bs-body-bg);
        display: inline-block;
        position: absolute;
        border-radius: 50%;
        border: 3px solid var(--bs-info);
        left: 23px;
        width: 14px;
        height: 14px;
        margin-top: 5px;
        z-index: 400;
    }
</style>