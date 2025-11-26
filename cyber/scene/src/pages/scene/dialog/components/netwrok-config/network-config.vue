<template>
  <div class="basic-info-wrapper network-config-wrapper">
    <!-- 镜像节点（且非内置）-->
    <cb-tabs
      v-model="active"
      class="protocol-tab"
      v-if="showProtocolOrFirewall === 'protocol' && portForm.length"
      :class="{'protocol-tab': true, 'active-tab-static': active === 'protocol-access'}"
    >
      <cb-tab-pane
        :label="$tt('target.protocolAccess')"
        name="protocol-access"
      >
        <div
          v-for="(item, index) in portForm"
          class="network-config-item"
          :key="JSON.stringify(item + index)"
        >
          <cb-row
            :class="{'port-wrapper': true, 'port-wrapper-first': index === 0}"
          >
            <cb-col :span="21">
              <span class="title source-port-name">{{ item.name }}</span>
              <span class="arrow-box arrow-box-left"></span>
              <span class="dot"> · · · · · · · · · · · · · · · · </span>
              <span class="arrow-box"></span>
              <span>{{ getTargetName(item.id, index) }}</span>
            </cb-col>
            <cb-col :span="3">
              <div class="btn-box">
                <cb-button
                  :disabled="isOriginalPort(item.id, index) || !isCurrentPortConnection(item.id, index)"
                  @click="deletePort(item.id, index)"
                  type="text"
                  icon="icon-shanchu"
                ></cb-button>
              </div>
            </cb-col>
          </cb-row>
          <cb-row class="port-title">
            <!-- 左侧 -->
            <cb-col
              :span="2"
              :style="{width: (lang == 'en-US' ? '12%' : '8.33333%')}"
              class="port-config-txt-box"
            >{{ $tt('target.accessPortConfigurations') }} ： </cb-col>
            <!-- 中间 -->
            <cb-col :span="22">
              <!-- 端口配置 -->
              <cb-row class="port-basic-txt">
                <!--端口配置-校验-->
                <cb-col :span="4">
                  <cb-form-item
                    label-width="10px"
                    :prop="'network.' + index + '.ip'"
                    :rules="FORM_RULES.networkConfig.ip"
                  >
                    <cb-tooltip
                      :disabled="!item.ip"
                      effect="dark"
                      content="IP"
                      placement="top-start"
                    >
                      <cb-input
                        :disabled="uneditableBySceneStatus"
                        size="small"
                        v-model="item.ip"
                        type="text"
                        placeholder="IP"
                      ></cb-input>
                    </cb-tooltip>
                  </cb-form-item>
                </cb-col>
                <cb-col :span="4">
                  <cb-form-item
                    label-width="8px"
                    :prop="'network.' + index + '.egress'"
                    :rules="FORM_RULES.networkConfig.egress"
                  >
                    <cb-tooltip
                      :disabled="!item.egress"
                      effect="dark"
                      :content="$tt('target.uplinkBandwidth')"
                      placement="top-start"
                    >
                      <cb-input
                        size="small"
                        v-model="item.egress"
                        type="text"
                        :placeholder="$tt('target.uplinkBandwidth')"
                      ></cb-input>
                    </cb-tooltip>
                  </cb-form-item>
                </cb-col>
                <cb-col :span="4">
                  <cb-form-item
                    label-width="8px"
                    :prop="'network.' + index + '.ingress'"
                    :rules="FORM_RULES.networkConfig.ingress"
                  >
                    <cb-tooltip
                      :disabled="!item.ingress"
                      effect="dark"
                      :content="$tt('target.downLinkBandwidth')"
                      placement="top-start"
                    >
                      <cb-input
                        size="small"
                        v-model="item.ingress"
                        type="text"
                        :placeholder="$tt('target.downLinkBandwidth')"
                      ></cb-input>
                    </cb-tooltip>
                  </cb-form-item>
                </cb-col>
                <cb-col :span="4">
                  <cb-form-item
                    label-width="8px"
                    v-if="showMode"
                    :prop="'network.' + index + '.connect_mode'"
                  >
                    <cb-tooltip
                      :disabled="!item.connect_mode"
                      effect="dark"
                      :content="$tt('target.portAccessType')"
                      placement="top-start"
                    >
                      <cb-select
                        :disabled="uneditableBySceneStatus"
                        v-model="item.connect_mode"
                        :options="CONNECT_MODE"
                        size="small"
                        width="100%"
                        :placeholder="$tt('global.placeSelect') + $tt('target.portAccessType')"
                      ></cb-select>
                    </cb-tooltip>
                  </cb-form-item>
                </cb-col>
              </cb-row>
            </cb-col>
          </cb-row>
          <!-- 地址段 虚拟路由器接入配置添加地址段-->
          <cb-row
            class="address-segment"
            v-if="nodeInfo.image_type != 'dynamips' && showProtocolOrFirewall !== 'firewall_rules' && nodeInfo.role == 21"
          >
            <cb-col
              :span="2"
              class="address-label"
              :style="{width: (lang == 'en-US' ? '12%' : '8.33333%')}"
            >
              {{ $tt('target.addresses') }} ：
            </cb-col>
            <cb-col :span="22">
              <cb-row>
                <cb-col :span="4">
                  <cb-form-item
                    label-width="10px"
                    :prop="'network.' + index + '.port_connect_net_cidr'"
                    :rules="FORM_RULES.networkConfig.address"
                  >
                    <cb-tooltip
                      :disabled="!item.port_connect_net_cidr"
                      effect="dark"
                      :content="$tt('target.addresses')"
                      placement="top-start"
                    >
                      <cb-input
                        :disabled="uneditableBySceneStatus"
                        size="small"
                        v-model="item.port_connect_net_cidr"
                        type="text"
                        :placeholder="$tt('target.placeInputAddresses')"
                      ></cb-input>
                    </cb-tooltip>
                  </cb-form-item>
                </cb-col>
              </cb-row>
            </cb-col>
          </cb-row>
          <!-- 添加接入协议 -->
          <template v-if="showProtocolOrFirewall === 'protocol'">
            <!-- 接入协议不为空 -->
            <template v-if="item.access_modes && item.access_modes.length">
              <div
                v-for="(protocol, idx) in item.access_modes"
                :key="JSON.stringify(protocol + index + idx)"
                :class="{'protocol-access-wrapper': protocol && protocol.protocol != 'console' && protocol.protocol != 'COM' }"
                :style="{paddingLeft: (lang == 'en-US' ? '168px' : '124px')}"
              >
                <template
                  v-if="protocol && protocol.protocol != 'console' && protocol.protocol != 'COM'"
                >
                  <cb-row class="flexCenter">
                    <!--接入协议配置-校验-->
                    <cb-col :span="3">
                      <cb-form-item
                        :prop="'network.' + index + '.access_modes.' + idx + '.protocol'"
                      >
                        <cb-tooltip
                          :disabled="!protocol.protocol"
                          effect="dark"
                          :content="$tt('target.protocol')"
                          placement="top-start"
                        >
                          <cb-select
                            :disabled="uneditableBySceneStatus"
                            clearable
                            size="small"
                            v-model="protocol.protocol"
                            :options="PROTOCOL_OPTIONS"
                            @change="changeProtocol($event, index, idx)"
                            class="protocol-select"
                            :popper-append-to-body="false"
                            width="100%"
                            :placeholder="$tt('global.placeSelect') + $tt('target.protocol')"
                          ></cb-select>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="3">
                      <cb-form-item
                        :prop="'network.' + index + '.access_modes.' + idx + '.port'"
                        :rules="FORM_RULES.networkConfig.port"
                      >
                        <cb-tooltip
                          :disabled="!protocol.port"
                          effect="dark"
                          :content="$tt('target.portNumber')"
                          placement="top-start"
                        >
                          <cb-input
                            :disabled="uneditableBySceneStatus"
                            size="small"
                            v-model="protocol.port"
                            type="text"
                            :placeholder="$tt('target.portNumber')"
                          ></cb-input>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="3">
                      <cb-form-item
                        :prop="'network.' + index + '.access_modes.' + idx + '.username'"
                        :rules="FORM_RULES.networkConfig.username"
                      >
                        <cb-tooltip
                          :disabled="!protocol.username"
                          effect="dark"
                          :content="$tt('global.userName')"
                          placement="top-start"
                        >
                          <cb-input
                            :disabled="uneditableBySceneStatus"
                            size="small"
                            v-model="protocol.username"
                            type="text"
                            :placeholder="$tt('global.userName')"
                          ></cb-input>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col
                      :span="3"
                      :style="{width: (lang == 'en-US' ? '14%' : '11%')}"
                    >
                      <cb-form-item
                        label-width="15px"
                        :prop="'network.' + index + '.access_modes.' + idx + '.proxy'"
                      >
                        <cb-checkbox
                          :disabled="uneditableBySceneStatus"
                          size="small"
                          v-model="protocol.proxy"
                          class="checkbox-box"
                        >
                          {{ $tt('target.allowDirectAccess') }}
                        </cb-checkbox>
                      </cb-form-item>
                    </cb-col>
                    <cb-col
                      :span="3"
                      v-if="['ssh', 'rdp'].includes(protocol.protocol)"
                    >
                      <cb-form-item
                        label-width="0px"
                        :prop="'network.' + index + '.access_modes.' + idx + '.manage_mode'"
                      >
                        <cb-checkbox
                          :disabled="uneditableBySceneStatus"
                          size="small"
                          v-model="protocol.manage_mode"
                          class="checkbox-box"
                        >
                          {{ $tt('target.administratorOnly') }}
                        </cb-checkbox>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="2">
                      <div class="btn-box protocol-add">
                        <cb-button
                          :disabled="uneditableBySceneStatus"
                          v-if="showAddBtn(idx, item.access_modes)"
                          type="text"
                          icon="icon-xinzeng"
                          @click="addProtocol(index)"
                        ></cb-button>
                        <cb-button
                          :disabled="uneditableBySceneStatus"
                          type="text"
                          icon="icon-jianshao"
                          class="add-btn"
                          @click="deleteProtocol(index, protocol, idx)"
                        ></cb-button>
                      </div>
                    </cb-col>
                  </cb-row>
                  <cb-row>
                    <!--ssh协议单独处理-->
                    <template v-if="protocol.protocol == 'ssh'">
                      <!--密码 密钥切换-->
                      <cb-col :span="3">
                        <cb-form-item
                          label-width="0px"
                          :prop="'network.' + index + '.access_modes.' + idx + '.private_key_enable'"
                          class="key-switch-box"
                        >
                          <cb-switch
                            :disabled="uneditableBySceneStatus"
                            class="switch-key-pwd"
                            size="small"
                            v-model="protocol.private_key_enable"
                            @change="changeKeyPwd($event, index, idx)"
                            :active-text="$tt('target.key')"
                            :inactive-text="$tt('target.password')"
                          ></cb-switch>
                        </cb-form-item>
                      </cb-col>
                      <cb-col
                        :span="7"
                        v-if="protocol.private_key_enable"
                        class="private-key-upload-box"
                      >
                        <private-key-upload
                          :index="index"
                          :idx="idx"
                          :private_key_file_name.sync="protocol.private_key_file_name"
                          :private_key_path.sync="protocol.private_key_path"
                        ></private-key-upload>
                      </cb-col>
                    </template>
                    <template
                      v-if="protocol.protocol != 'ssh' || (protocol.protocol == 'ssh' && !protocol.private_key_enable)"
                    >
                      <cb-col :span="6">
                        <cb-form-item
                          :prop="'network.' + index + '.access_modes.' + idx + '.password'"
                          :rules="FORM_RULES.networkConfig.password"
                        >
                          <cb-tooltip
                            :disabled="!protocol.password"
                            effect="dark"
                            :content="$tt('global.password')"
                            placement="top-start"
                          >
                            <cb-input
                              :disabled="uneditableBySceneStatus"
                              size="small"
                              v-model="protocol.password"
                              type="text"
                              :placeholder="$tt('global.password')"
                            ></cb-input>
                          </cb-tooltip>
                        </cb-form-item>
                      </cb-col>
                      <cb-col :span="protocol.protocol == 'ssh' ? 13 : 16">
                        <cb-form-item
                          :prop="'network.' + index + '.access_modes.' + idx + '.description'"
                          :rules="FORM_RULES.networkConfig.description"
                        >
                          <cb-tooltip
                            :disabled="!protocol.desc"
                            effect="dark"
                            :content="$tt('target.additionalInformation')"
                            placement="top-start"
                          >
                            <cb-input
                              :disabled="uneditableBySceneStatus"
                              size="small"
                              v-model="protocol.desc"
                              type="text"
                              :placeholder="$tt('target.additionalInformation')"
                            ></cb-input>
                          </cb-tooltip>
                        </cb-form-item>
                      </cb-col>
                    </template>
                  </cb-row>
                </template>
              </div>
            </template>
            <!-- 接入协议为空 -->
            <template v-if="showEmpty(index)">
              <cb-row class="empty-protocol">
                <empty-box
                  :eid="eid"
                  :nodeInfo="nodeInfo"
                  @click="addProtocol(index)"
                ></empty-box>
              </cb-row>
            </template>
          </template>
        </div>
      </cb-tab-pane>
      <cb-tab-pane
        v-if="nodeInfo.image_type !== 'dynamips'"
        :label="$tt('target.directAccess')"
        name="direct-access"
      >
        <div class="direct-access-wrapper">
          <cb-row class="console-access-wrapper">
            <template
              v-if="consoleConfigForm && Object.keys(consoleConfigForm).length"
            >
              <cb-col :span="4">
                <cb-tooltip
                  :disabled="!consoleConfigForm.protocol"
                  effect="dark"
                  :content="$tt('target.protocol')"
                  placement="top-start"
                >
                  <cb-select
                    :disabled="uneditableBySceneStatus"
                    size="small"
                    v-model="consoleConfigForm.protocol"
                    :options="PROTOCOL_OPTIONS_CONSOLE"
                    class="protocol-select"
                    :popper-append-to-body="false"
                    width="100%"
                  ></cb-select>
                </cb-tooltip>
              </cb-col>
              <cb-col :span="4">
                <cb-form-item>
                  <cb-tooltip
                    :disabled="!consoleConfigForm.username"
                    effect="dark"
                    :content="$tt('global.userName')"
                    placement="top-start"
                  >
                    <cb-input
                      :disabled="uneditableBySceneStatus"
                      size="small"
                      v-model="consoleConfigForm.username"
                      type="text"
                      :placeholder="$tt('global.userName')"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
              <cb-col :span="4">
                <cb-form-item>
                  <cb-tooltip
                    :disabled="!consoleConfigForm.password"
                    effect="dark"
                    :content="$tt('global.password')"
                    placement="top-start"
                  >
                    <cb-input
                      :disabled="uneditableBySceneStatus"
                      size="small"
                      v-model="consoleConfigForm.password"
                      type="text"
                      :placeholder="$tt('global.password')"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item>
                  <cb-tooltip
                    :disabled="!consoleConfigForm.desc"
                    effect="dark"
                    :content="$tt('target.additionalInformation')"
                    placement="top-start"
                  >
                    <cb-input
                      :disabled="uneditableBySceneStatus"
                      size="small"
                      v-model="consoleConfigForm.desc"
                      type="text"
                      :placeholder="$tt('target.additionalInformation')"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
              <cb-col :span="3">
                <cb-form-item class="administrator-only-box">
                  <cb-checkbox
                    :disabled="uneditableBySceneStatus"
                    size="small"
                    v-model="consoleConfigForm.manage_mode"
                    class="checkbox-box"
                  >
                    {{ $tt('target.administratorOnly') }}
                  </cb-checkbox>
                </cb-form-item>
              </cb-col>
              <cb-col :span="2">
                <div class="btn-box protocol">
                  <cb-button
                    :disabled="uneditableBySceneStatus"
                    type="text"
                    icon="icon-jianshao"
                    @click="deleteConsole()"
                  ></cb-button>
                </div>
              </cb-col>
            </template>
          </cb-row>
          <!-- 接入协议为空 -->
          <template
            v-if="!(consoleConfigForm && Object.keys(consoleConfigForm).length)"
          >
            <cb-row class="empty-protocol">
              <empty-box
                :eid="eid"
                :nodeInfo="nodeInfo"
                @click="addConsole()"
              ></empty-box>
            </cb-row>
          </template>
        </div>
      </cb-tab-pane>
    </cb-tabs>
    <!-- 除了镜像节点（且非内置）(1. 只展示端口 2. 展示端口和防火墙规则的)  dyanmips只展示IP-->
    <template v-if="showProtocolOrFirewall != 'protocol'">
      <div
        v-if="nodeInfo.image_type === 'dynamips' && network.length"
        class="telnet-box"
      >
        <span class="access-label">{{$tt('target.accessType')}} ：</span>
        <cb-checkbox
          :disabled="uneditableBySceneStatus"
          size="small"
          v-model="telnetConfigForm.isTelnet"
          @change="changeTelnet($event)"
        >
          telnet
        </cb-checkbox>
        <cb-checkbox
          :disabled="uneditableBySceneStatus || !telnet_config.isTelnet"
          size="small"
          v-model="telnetConfigForm.proxy"
        >
          {{ $tt('target.allowDirectAccess') }}
        </cb-checkbox>
      </div>
      <div
        v-for="(item, index) in portForm"
        class="network-config-item protocol-simple"
        :key="JSON.stringify(item + index)"
      >
        <cb-row
          :class="{'port-wrapper': true, 'port-wrapper-first': index === 0}"
        >
          <cb-col
            :span="21"
            class="title-box-port"
          >
            <span class="title source-port-name">{{ item.name }}</span>
            <span class="arrow-box arrow-box-left"></span>
            <span class="dot"> · · · · · · · · · · · · · · · · </span>
            <span class="arrow-box"></span>
            <span>{{ getTargetName(item.id, index) }}</span>
          </cb-col>
          <cb-col :span="3">
            <div class="btn-box">
              <cb-button
                v-if="nodeInfo.image_type != 'dynamips'"
                :disabled="uneditableBySceneStatus || !isCurrentPortConnection(item.id, index)"
                @click="deletePort(item.id, index)"
                type="text"
                icon="icon-shanchu"
              ></cb-button>
            </div>
          </cb-col>
        </cb-row>
        <cb-row class="port-title">
          <!-- 左侧接入端口配置 -->
          <cb-col
            :span="2"
            :style="{width: (lang == 'en-US' ? '12%' : '8.33333%')}"
            class="port-config-txt-box"
          >{{ $tt('target.accessPortConfigurations') }} ： </cb-col>
          <!-- 中间 -->
          <cb-col :span="22">
            <!-- 端口配置 -->
            <cb-row class="port-basic-txt">
              <!--端口配置-校验-->
              <cb-col :span="4">
                <!--端口配置-校验-->
                <cb-form-item
                  label-width="10px"
                  :prop="'network.' + index + '.ip'"
                  :rules="FORM_RULES.networkConfig.ip"
                >
                  <cb-tooltip
                    :disabled="!item.ip"
                    effect="dark"
                    content="IP"
                    placement="top-start"
                  >
                    <cb-input
                      :disabled="uneditableBySceneStatus"
                      size="small"
                      v-model="item.ip"
                      type="text"
                      placeholder="IP"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
              <cb-col
                v-if="nodeInfo.image_type != 'dynamips'"
                :span="4"
              >
                <cb-form-item
                  label-width="8px"
                  :prop="'network.' + index + '.egress'"
                  :rules="FORM_RULES.networkConfig.egress"
                >
                  <cb-tooltip
                    :disabled="!item.egress"
                    effect="dark"
                    :content="$tt('target.uplinkBandwidth')"
                    placement="top-start"
                  >
                    <cb-input
                      size="small"
                      v-model="item.egress"
                      type="text"
                      :placeholder="$tt('target.uplinkBandwidth')"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
              <cb-col
                v-if="nodeInfo.image_type != 'dynamips'"
                :span="4"
              >
                <cb-form-item
                  label-width="8px"
                  :prop="'network.' + index + '.ingress'"
                  :rules="FORM_RULES.networkConfig.ingress"
                >
                  <cb-tooltip
                    :disabled="!item.ingress"
                    effect="dark"
                    :content="$tt('target.downLinkBandwidth')"
                    placement="top-start"
                  >
                    <cb-input
                      size="small"
                      v-model="item.ingress"
                      type="text"
                      :placeholder="$tt('target.downLinkBandwidth')"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
              <cb-col
                v-if="nodeInfo.image_type != 'dynamips'"
                :span="3"
              >
                <cb-form-item
                  v-if="showMode"
                  label-width="8px"
                  :prop="'network.' + index + '.delay'"
                  :rules="FORM_RULES.networkConfig.delay"
                >
                  <cb-tooltip
                    :disabled="!item.delay"
                    effect="dark"
                    :content="$tt('target.delay')"
                    placement="top-start"
                  >
                    <cb-input
                      size="small"
                      v-model="item.delay"
                      type="text"
                      :placeholder="$tt('target.delay')"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
              <cb-col
                v-if="nodeInfo.image_type != 'dynamips'"
                :span="4"
              >
                <cb-form-item
                  label-width="8px"
                  v-if="showMode"
                  :prop="'network.' + index + '.loss'"
                  :rules="FORM_RULES.networkConfig.loss"
                >
                  <cb-tooltip
                    :disabled="!item.loss"
                    effect="dark"
                    :content="$tt('target.loss')"
                    placement="top-start"
                  >
                    <cb-input
                      size="small"
                      v-model="item.loss"
                      type="text"
                      :placeholder="$tt('target.loss')"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
              <cb-col
                v-if="nodeInfo.image_type != 'dynamips'"
                :span="4"
              >
                <cb-form-item
                  label-width="8px"
                  v-if="showMode"
                  :prop="'network.' + index + '.connect_mode'"
                >
                  <cb-tooltip
                    :disabled="!item.connect_mode"
                    effect="dark"
                    :content="$tt('target.portAccessType')"
                    placement="top-start"
                  >
                    <cb-select
                      :disabled="uneditableBySceneStatus"
                      v-model="item.connect_mode"
                      :options="CONNECT_MODE"
                      size="small"
                      width="100%"
                      :placeholder="$tt('global.placeSelect') + $tt('target.portAccessType')"
                    ></cb-select>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
            </cb-row>
            <!-- 添加防火墙规则 -->
            <template v-if="showProtocolOrFirewall === 'firewall_rules'">
              <template
                v-if="item.firewall_rules && item.firewall_rules.length">
                <div
                  v-for="(rule, idx) in item.firewall_rules"
                  :key="JSON.stringify('firewall_rules' + index + idx)"
                  class="protocol-access-wrapper"
                >
                  <!--防火墙规则配置-校验-->
                  <cb-row class="flexCenter">
                    <cb-col :span="4">
                      <cb-form-item
                        :prop="'network.' + index + '.firewall_rules.' + idx + '.protocol'"
                      >
                        <cb-tooltip
                          :disabled="!rule.protocol"
                          effect="dark"
                          :content="$tt('target.protocol')"
                          placement="top-start"
                        >
                          <cb-select
                            ref="protocolSelectRef"
                            clearable
                            size="small"
                            v-model="rule.protocol"
                            :options="FIREWALL_RULES_PROTOCOL_OPTIONS"
                            @change="changeFirewallRules($event, index, idx)"
                            :popper-append-to-body="false"
                            width="100%"
                            :placeholder="$tt('global.placeSelect') + $tt('target.protocol')"
                          ></cb-select>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="4">
                      <cb-form-item
                        :prop="'network.' + index + '.firewall_rules.' + idx + '.action'"
                        :rules="FORM_RULES.networkConfig.action"
                      >
                        <cb-tooltip
                          :disabled="!rule.action"
                          effect="dark"
                          :content="$tt('target.action')"
                          placement="top-start"
                        >
                          <cb-select
                            clearable
                            size="small"
                            v-model="rule.action"
                            :options="FIREWALL_RULES_ACTION_OPTIONS"
                            :popper-append-to-body="false"
                            width="100%"
                            :placeholder="$tt('global.placeSelect') + $tt('target.action')"
                          ></cb-select>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="4">
                      <cb-form-item
                        :prop="'network.' + index + '.firewall_rules.' + idx + '.direction'"
                        :rules="FORM_RULES.networkConfig.direction"
                      >
                        <cb-tooltip
                          :disabled="!rule.direction"
                          effect="dark"
                          :content="$tt('target.direction')"
                          placement="top-start"
                        >
                          <cb-select
                            clearable
                            size="small"
                            v-model="rule.direction"
                            :options="FIREWALL_RULES_DIRECTION_OPTIONS"
                            width="100%"
                            :popper-append-to-body="false"
                            :placeholder="$tt('global.placeSelect') + $tt('target.direction')"
                          ></cb-select>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="9">
                      <div class="btn-box protocol-add">
                        <cb-button
                          v-if="idx == item.firewall_rules.length - 1 && item.firewall_rules.length < 99"
                          type="text"
                          icon="icon-xinzeng"
                          @click="addProtocol(index)"
                        ></cb-button>
                        <cb-button
                          type="text"
                          icon="icon-jianshao"
                          class="add-btn"
                          @click="deleteProtocol(index, rule, idx)"
                        ></cb-button>
                      </div>
                    </cb-col>
                  </cb-row>
                  <cb-row>
                    <cb-col :span="5">
                      <cb-form-item
                        :prop="'network.' + index + '.firewall_rules.' + idx + '.source_ip_address'"
                        :rules="FORM_RULES.networkConfig.ipAddress"
                      >
                        <cb-tooltip
                          :disabled="!rule.source_ip_address"
                          effect="dark"
                          :content="$tt('target.sourceIp')"
                          placement="top-start"
                        >
                          <cb-input
                            size="small"
                            v-model="rule.source_ip_address"
                            type="text"
                            :placeholder="$tt('global.placeInput') + $tt('target.sourceIp')"
                          ></cb-input>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="5">
                      <cb-form-item
                        :prop="'network.' + index + '.firewall_rules.' + idx + '.source_port'"
                        :rules="FORM_RULES.networkConfig.firewallPort"
                      >
                        <cb-tooltip
                          :disabled="!rule.source_port"
                          effect="dark"
                          :content="$tt('target.sourcePort')"
                          placement="top-start"
                        >
                          <cb-input
                            size="small"
                            v-model="rule.source_port"
                            type="text"
                            :disabled="['icmp', 'all', null, '', undefined].includes(rule.protocol)"
                            :placeholder="$tt('global.placeInput') + $tt('target.sourcePort')"
                          ></cb-input>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="5">
                      <cb-form-item
                        :prop="'network.' + index + '.firewall_rules.' + idx + '.destination_ip_address'"
                        :rules="FORM_RULES.networkConfig.ipAddress"
                      >
                        <cb-tooltip
                          :disabled="!rule.destination_ip_address"
                          effect="dark"
                          :content="$tt('target.targetIp')"
                          placement="top-start"
                        >
                          <cb-input
                            size="small"
                            v-model="rule.destination_ip_address"
                            type="text"
                            :placeholder="$tt('global.placeInput') + $tt('target.targetIp')"
                          ></cb-input>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                    <cb-col :span="5">
                      <cb-form-item
                        :prop="'network.' + index + '.firewall_rules.' + idx + '.destination_port'"
                        :rules="FORM_RULES.networkConfig.firewallPort"
                      >
                        <cb-tooltip
                          :disabled="!rule.destination_port"
                          effect="dark"
                          :content="$tt('target.targetPort')"
                          placement="top-start"
                        >
                          <cb-input
                            size="small"
                            v-model="rule.destination_port"
                            type="text"
                            :disabled="['icmp', 'all', null, '', undefined].includes(rule.protocol)"
                            :placeholder="$tt('global.placeInput') + $tt('target.targetPort')"
                          ></cb-input>
                        </cb-tooltip>
                      </cb-form-item>
                    </cb-col>
                  </cb-row>
                </div>
              </template>
              <!-- 接入协议为空 -->
              <template
                v-if="(!item.firewall_rules || !item.firewall_rules.length)"
              >
                <cb-row
                  class="empty-protocol"
                  :style="{'padding-right': (lang == 'en-US' ? '12%' : '8.33333%')}"
                >
                  <empty-box
                    :eid="eid"
                    :nodeInfo="nodeInfo"
                    @click="addProtocol(index)"
                  ></empty-box>
                </cb-row>
              </template>
            </template>
          </cb-col>
        </cb-row>
        <!-- 地址段 简易路由器和核心路由器接入配置添加地址段-->
        <cb-row
          class="address-segment"
          v-if="nodeInfo.image_type != 'dynamips' && showProtocolOrFirewall !== 'firewall_rules'"
        >
          <cb-col
            :span="2"
            class="address-label"
            :style="{width: (lang == 'en-US' ? '12%' : '8.33333%')}"
          >
            {{ $tt('target.addresses') }} ：
          </cb-col>
          <cb-col :span="22">
            <cb-row>
              <cb-col :span="4">
                <cb-form-item
                  label-width="10px"
                  :prop="'network.' + index + '.port_connect_net_cidr'"
                  :rules="FORM_RULES.networkConfig.address"
                >
                  <cb-tooltip
                    :disabled="!item.port_connect_net_cidr"
                    effect="dark"
                    :content="$tt('target.addresses')"
                    placement="top-start"
                  >
                    <cb-input
                      :disabled="uneditableBySceneStatus"
                      size="small"
                      v-model="item.port_connect_net_cidr"
                      type="text"
                      :placeholder="$tt('target.placeInputAddresses')"
                    ></cb-input>
                  </cb-tooltip>
                </cb-form-item>
              </cb-col>
            </cb-row>
          </cb-col>
        </cb-row>
      </div>
    </template>
    <div
      v-if="!portForm.length"
      class="empty-wrapper"
    >
      {{ $tt('target.notOpenedPort') }}
    </div>
  </div>
</template>

<script>
/**
 * 所有镜像类型的节点 网络配置 展示添加接入协议
 * 简易型防火墙展示 防火墙规则
 */
import t from '../../../../../utils/i18n';
import { computed, inject, ref } from '@vue/composition-api';
import EmptyBox from "../empty-box/empty-box";
import { FORM_RULES } from "../constant/form-rules";
import {
  PROTOCOL_OPTIONS,
  FIREWALL_RULES_PROTOCOL_OPTIONS,
  FIREWALL_RULES_ACTION_OPTIONS,
  FIREWALL_RULES_DIRECTION_OPTIONS,
  PROTOCOL_OPTIONS_CONSOLE,
  CONNECT_MODE,
} from "../constant/options"
import _ from "lodash";
import getNodeCategory from "../../../../../types/get-node-category";
import { ROLE } from "../../../../../types/role";
import PrivateKeyUpload from "./private-key-upload";
import { getCategoryUUID } from "../../../../../utils/common";
import { getNodeNameByPortId, getPortNameByPortId } from "../../../../../utils/port-processing/port-generation";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "network-config",
  components: {
    EmptyBox,
    PrivateKeyUpload,
  },
  props: {
    network: {
      type: Array,
      default: () => []
    },
    nodeInfo: {
      type: Object,
      default: () => {
      }
    },
    is_build_in: {
      type: Boolean,
      default: false,
    },
    console_config: {
      type: Object,
      default: () => {
      }
    },
    telnet_config: {
      type: Object,
      default: () => {
      }
    },
    lang: {
      type: String,
      default: ''
    },
    activeProtocolName: {
      type: String,
      default: ''
    },
    /**
     * 是否展示端口连接类型
     */
    showMode: {
      type: Boolean,
      default: false
    },
    topologyEdges: {
      type: Array,
      default: () => []
    },
    topologyNodes: {
      type: Array,
      default: () => []
    },
    // 节点的实例id
    eid: {
      type: String,
      default: ''
    },
    /**
     * 用于在动态更新终端节点时，判断当前端口是否是新增端口，如果不是，则禁用端口的删除按钮
     */
    originalCount: {
      type: Object,
      default: () => {
      },
    },
  },
  setup(props, { emit }) {
    let protocolSelectRef = ref(null);
    const { type: nodeType } = getNodeCategory(props.nodeInfo.role, props.nodeInfo.image_type, props.is_build_in);
    let active = computed({
      get: () => {
        return props.activeProtocolName
      },
      set: (val) => {
        emit('update:activeProtocolName', val);
        return val;
      }
    })
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        if (props.nodeInfo.role === 4) {
          if (props.eid) {
            return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
          } else {
            return false;
          }
        } else {
          return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
        }
      },
    });
    // 展示接入协议还是防火墙规则 TODO 终端设备
    const showProtocolOrFirewall = computed({
      get: () => {
        if (props.nodeInfo.role === ROLE['firewall'] && props.nodeInfo.image_type === 'simple') {
          return 'firewall_rules';
        } else if (['vm', 'container'].includes(props.nodeInfo.image_type) && !props.is_build_in) {
          return 'protocol';
        } else {
          return 'protocol-simple';
        }
      },
    });
    // 回显端口配置
    const portForm = computed({
      get: () => {
        if (props.network) {
          props.network.forEach((item) => {
            if (!item.id) {
              item.id = getCategoryUUID({ type: "port" });
            }
            if (item.ingress === -1) {
              item.ingress = null;
            }
            if (item.egress === -1) {
              item.egress = null;
            }
            if (item.delay === -1) {
              item.delay = null;
            }
            if (item.loss === -1) {
              item.loss = null;
            }
          });
          /**
           * 拆分成 协议接入 和 直接接入
           * 处理console协议接入信息，将原console协议拆到单独变量里
           */
          // if (showProtocolOrFirewall.value === 'protocol') {
          //   props.network.forEach((item, index) => {
          //     let consoleProtocolIndex = item.access_modes?.findIndex(protocol => protocol?.protocol == 'console');
          //     if ((consoleProtocolIndex || consoleProtocolIndex == 0)) {
          //       if (_.isEmpty(console_config.value)) {
          //         console_config.value = _.cloneDeep({...item.access_modes[consoleProtocolIndex]});
          //       }
          //     }
          //   })
          // }
          // console.log(props.network, 'props.network');
          return props.network;
        }
      },
      set: (val) => {
        emit('update:network', val);
        return val;
      }
    });
    // 回显直接接入
    const consoleConfigForm = computed({
      get: () => {
        if (props.console_config) {
          return props.console_config;
        }
      },
      set: (val) => {
        emit('update:console_config', val);
        return val;
      }
    });
    // 回显dynamips节点的telnet接入
    const telnetConfigForm = computed({
      get: () => {
        if (props.telnet_config) {
          return props.telnet_config;
        }
      },
      set: (val) => {
        emit('update:telnet_config', val);
        return val;
      }
    });
    // 是否展示添加按钮
    const showAddBtn = (idx, access_modes) => {
      let hasConsoleProtocol = consoleConfigForm && (Object.keys(consoleConfigForm).length > 0);
      return idx === access_modes.length - (hasConsoleProtocol ? 1 : 0);
    }

    // 是否展示 空白接入协议组件
    const showEmpty = (index) => {
      let access_modes = _.compact(portForm.value[index].access_modes);
      if (access_modes.length > 0 && access_modes[0]?.hasOwnProperty('protocol')) {
        return access_modes.length === 1 && (access_modes[0].protocol == 'console' || access_modes[0].protocol == 'COM');
      } else {
        return true
      }
    }

    const getTargetName = (sourcePortId, index) => {
      // 先判断props.topologyEdges中是否有该端口id,如果有，则正常获取，否则，就从跨层连线数据中取
      let targetName = "--";
      if (!portForm.value[index]?.usable && props.topologyEdges.some(edge => edge.source === sourcePortId || edge.target === sourcePortId)) {
        for (let i = 0; i < props.topologyEdges.length; i++) {
          let item = props.topologyEdges[i];
          let name = item.name && JSON.parse(item.name);
          //  获取到与当前节点的portid 有关的edges信息
          if (sourcePortId == item.source) {
            const targetId = item.target; // 目标端口id
            let currentName = getNodeNameByPortId(targetId);
            const nodeName = " (" + currentName + ")";
            targetName = getPortNameByPortId(item.target) + nodeName;
            return targetName;
          } else if (sourcePortId == item.target) {
            const sourceId = item.source; // 目标端口id
            let currentName = getNodeNameByPortId(sourceId);
            const nodeName = " (" + currentName + ")";
            targetName = getPortNameByPortId(item.source) + nodeName;
            return targetName;
          }
        }
        return targetName;
      } else {
        let getEdge = sceneStore.state.crossLevelConnection.find(edge => edge.target === sourcePortId || edge.source === sourcePortId);
        if (getEdge?.info) {
          if (getEdge.source === sourcePortId) {
            return JSON.parse(getEdge?.name).target + " (" +JSON.parse(getEdge?.info).target + ")";
          }
          if (getEdge.target === sourcePortId) {
            return JSON.parse(getEdge?.name).source + " (" +JSON.parse(getEdge?.info).source + ")";
          }
        }
      }
    }

    // 是否是新增的端口，不是的话需要禁用删除端口按钮
    const isOriginalPort = (portId, index) => {
      if (sceneStore.state.sceneStatus !== 'edit') {
        // 终端节点需要判断是否是新增的端口
        if (props.nodeInfo.role === ROLE['terminal']) {
          if (props.originalCount?.portIds?.some(id => id == portId)) {
            return true;
          } else {
            return false;
          }
        }
      }
      return false;
    }

    // 当前端口与当前层的节点进行连线
    const isCurrentPortConnection = (portId, index) => {
      // 当前端口是否与其他层的端口相连，如果相连的话，则不允许删除该端口
      return portForm.value[index]?.usable || props.topologyEdges.some(edge => edge.source === portId || edge.target === portId);
    }

    const changeKeyPwd = (event, index, idx) => {
      if (!event) {
        portForm.value[index].access_modes[idx].private_key_enable = false;
        portForm.value[index].access_modes[idx].private_key_path = null;
        portForm.value[index].access_modes[idx].private_key_file_name = null;
      }
    }

    // 切换接入协议，由ssh->其他协议，需要将 三个字段清空
    const changeProtocol = (val, index, idx) => {
      if (val) {
        let protocol = portForm.value[index].access_modes[idx];
        if (protocol.protocol != 'ssh') {
          changeKeyPwd(false, index, idx);
        }
        let protocolFilterArr = PROTOCOL_OPTIONS.filter(option => option.value === protocol.protocol)[0];
        if (protocolFilterArr) {
          portForm.value[index].access_modes[idx].port = protocolFilterArr.port || '';
        }
      }
    }

    // 切换防火墙的协议
    const changeFirewallRules = (val, index, idx) => {
      let protocol = portForm.value[index].firewall_rules[idx];
      if (val) {
        if (['icmp', 'all'].includes(val)) {
          protocol.source_port = null;
          protocol.destination_port = null;
        }
      } else {
        protocol.source_port = null;
        protocol.destination_port = null;
      }
    }

    const deletePort = (portId, index, console_config) => {
      emit('delete-port', portId, index, console_config);
      portForm.value.splice(index, 1);
    }

    // 添加console协议
    const addConsole = () => {
      consoleConfigForm.value = {
        auth_protocol: '',
        desc: '',
        hostname: '',
        password: '',
        port: null,
        protocol: 'console',
        username: '',
      }
    }

    // 删除console协议
    const deleteConsole = () => {
      consoleConfigForm.value = {}
    }

    // 新增协议
    const addProtocol = (index) => {
      let addData = {};
      if (showProtocolOrFirewall.value === 'protocol') {
        addData = {
          auth_protocol: null,
          desc: null,
          hostname: null,
          password: null,
          port: null,
          protocol: null,
          proxy: true,
          username: null,
          private_key_enable: false,
          private_key_file_name: null,
          private_key_path: null,
        }
        if (!portForm.value[index] || !portForm.value[index].hasOwnProperty('access_modes') || !portForm.value[index]['access_modes']) {
          Object.assign(portForm.value[index], { access_modes: [] });
        }
        portForm.value[index].access_modes.push(addData);
      }
      if (showProtocolOrFirewall.value === 'firewall_rules') {
        addData = {
          protocol: '',
          action: '',
          direction: '',
          source_ip_address: '',
          source_port: '',
          destination_ip_address: '',
          destination_port: '',
        }
        if (!portForm.value[index] || !portForm.value[index].hasOwnProperty('firewall_rules') || !portForm.value[index]['firewall_rules']) {
          Object.assign(portForm.value[index], { firewall_rules: [] });
        }
        portForm.value[index].firewall_rules.push(addData);
      }
    }

    // 删除协议
    const deleteProtocol = (index, protocol, idx) => {
      if (showProtocolOrFirewall.value === 'protocol') {
        portForm.value[index]?.access_modes.splice(idx, 1);
      }
      if (showProtocolOrFirewall.value === 'firewall_rules') {
        portForm.value[index]?.firewall_rules.splice(idx, 1);
      }
    }

    const blurProtocolSelect = () => {
      protocolSelectRef.value[0].blur()
    }

    const changeIp = (data) => {
      emit('change-ip', { id: data.id, ip: data.ip })
    }

    const changeTelnet = (event) => {
      if (!event) {
        telnetConfigForm.value.proxy = false;
      }
    }

    return {
      FORM_RULES,
      PROTOCOL_OPTIONS,
      FIREWALL_RULES_PROTOCOL_OPTIONS,
      FIREWALL_RULES_ACTION_OPTIONS,
      FIREWALL_RULES_DIRECTION_OPTIONS,
      PROTOCOL_OPTIONS_CONSOLE,
      CONNECT_MODE,
      uneditableBySceneStatus,
      protocolSelectRef,
      portForm,
      showProtocolOrFirewall,
      nodeType,
      consoleConfigForm,
      active,
      telnetConfigForm,
      changeTelnet,
      changeFirewallRules,
      showAddBtn,
      deleteConsole,
      addConsole,
      blurProtocolSelect,
      showEmpty,
      changeKeyPwd,
      getTargetName,
      changeProtocol,
      deleteProtocol,
      addProtocol,
      deletePort,
      $tt: t,
      changeIp,
      isOriginalPort,
      isCurrentPortConnection,
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-info-wrapper.network-config-wrapper {
  .cb-select {
    width: 100%;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin: 0 !important;
    }
  }
}
.arrow-box {
  display: inline-block;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-left-color: var(--neutral4);
  content: '';
  padding-right: 7px;
  &.arrow-box-left {
    transform: rotate(180deg);
  }
}
.dot {
  color: var(--neutral4);
}
.telnet-box {
  display: flex;
  margin-bottom: 16px;
  margin-left: 16px;
  .access-label {
    margin-right: 12px;
    margin-top: 3px;
  }
}
</style>
