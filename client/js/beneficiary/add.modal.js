import { Modal, Form, Session } from 'rumsan-ui';
import config from '../config';
import Service from './service';
import cashAidArtifact from '../../../build/contracts/CashAid';

import { initContract } from '../helper/contract';

class AddBeneficiary extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.web3 = cfg.web3;
    this.registerEvents('beneficiary-added', 'aid-selected');
    this.renderAidSelector();
    this.on('aid-selected', async (e, d) => {
      try {
        this.instance = await initContract(this.web3, cashAidArtifact, d.eth_address);
      } catch (e) {
        console.error(e);
      }
    });

    this.comp.submit(async (e) => {
      e.preventDefault();
      try {
        this.addBeneficiary();
      } catch (e) {
        console.error(e);
      }
    });
  }

  async addBeneficiary() {
    if (!this.comp.validate()) return;

    const data = await this.form.get();

    const resData = await Service.add(data);
    if (!resData) return;

    this.fire('beneficiary-added', resData);
    this.form.clear();
    this.close();
  }

  renderAidSelector() {
    try {
      $(`${this.target} [name=aidId]`).select2({
        dropdownParent: $(`${this.target} .modal-header`),
        width: '100%',
        placeholder: 'Search/Select',
        ajax: {
          url: `${config.apiPath}/aid`,
          headers: Session.getToken(),
          dataType: 'json',
          data(params) {
            const query = {
              name: params.term,
              // limit: 5
            };
            return query;
          },
          processResults: (data) => {
            const results = _.map(data.data, (d) => {
              d.id = d._id;

              return d;
            });
            return {
              results,
            };
          },
          cache: true,
        },
        escapeMarkup: (markup) => markup,
        templateResult: (data) => {
          if (data.loading) {
            return data.text;
          }
          const markup = `<div class="row" style="max-width:98%">
            <div class="col text-left">${data.name}</div>
          </div>`;
          return markup;
        },
        templateSelection: (data) => {
          this.fire('aid-selected', data);
          return data.name || data.text;
        },
      });
    } catch (e) {
      console.log(error);
      return error;
    }
  }

  async setContractAddress(aidId, data) {
    const resData = await Service.update(aidId, data);
    if (!resData) return;

    this.fire('contract-deployed', resData);
  }
}

export default AddBeneficiary;
