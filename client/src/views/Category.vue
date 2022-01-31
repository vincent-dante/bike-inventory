<template>
  <div>
    <div>

      <br>
      <br>
        <button @click="$router.go(-1)" class="btn btn-dark btn-sm">
          <i class="bi bi-backspace"></i>
          Back
        </button>
      <br>
      <br>

      <div class="d-flex flex-wrap justify-content-between">
        <div>
          <button 
            type="button"  
            class="btn btn-danger btn-sm" 
            @click="openDialogModal"
          >
            <i class="bi bi-trash"></i>
            Delete
          </button>
        </div>
        <div>
          <button
            type="button" 
            value="Add" 
            class="btn btn-primary btn-sm" 
            @click="addItem"
          >
            <i class="bi bi-plus-circle"></i> 
            Add Item
          </button>
        </div>
      </div>

      <br>

      <table class="table table-striped table-hover table-sm table-bordered">
        <thead class="table-dark">
          <tr>
            <th scope="col" class="text-center">#</th>
            <th scope="col">Category Name</th>
          </tr>
        </thead>
        <tbody>  
          <tr v-for="(data, id) in data" :key="id" @click="getRowData(data)">
            <th scope="row" @click.stop class="th-firstrow">
              <input type="checkbox" name="" id="" v-model="deleteList" :value="data.category_id">
            </th>
            <td>{{ data.category_name }}</td>         
          </tr>
        </tbody>
      </table>  
    </div>


    <!--- Modal Form --->
    <div class="modal fade" id="formModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="categoryName" class="form-label">Category Name</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" id="categoryName" v-model="formData.categoryName">
              </div>
              <div class="form-text text-danger" v-if="showRequired">*Required Field</div>
            </div>
          
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            <button 
              type="button" 
              class="btn btn-primary btn-sm" 
              @click="submitForm"
            >
              {{ submitButtonText }}
            </button>
          </div> 
        </div>
      </div>
    </div>

    <!-- Dialog Modal -->
    <div class="modal fade" id="dialogModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            {{ messageModal.message }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            <button 
              type="button" 
              class="btn btn-danger btn-sm"
              v-if="messageModal.condition === 'delete'"
              @click="deleteSubmit"
              >Delete</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import { Modal } from 'bootstrap'


export default {
  name: 'Home',
  data(){
    return {
      data: [],
      formData: {
        categoryId: '',
        categoryName: '',
      },
      submitCondition: 'add',
      deleteList: [],
      messageModal: {
        condition: '',
        message: ''
      },
      showRequired: false
    }
  },
  mounted(){

    this.getCategoryList();

    this.formModal = new Modal(document.getElementById('formModal'), {
      keyboard: false
    });
    this.dialogModal = new Modal(document.getElementById('dialogModal'), {
      keyboard: false
    });

  },
  methods: {
    getRowData(d){

      const form = this.formData;

      form.categoryId = d.category_id;
      form.categoryName = d.category_name;

      this.submitCondition = 'edit';
      this.showRequired = false;
      this.formModal.show();

    },
    addItem(){ //Clear Input for Add Form

      const data = this.formData;

      for (const key in data) {
        data[key] = '';
      }

      this.submitCondition = 'add';
      this.showRequired = false;
      this.formModal.show();

    },
    submitForm(){

      if (
          this.formData.categoryName.length < 1 
        )
      {
        this.showRequired = true;
      } 
      else {

        if(this.submitCondition === 'add'){
          this.addSubmit();
        } else {
          this.updateSubmit();
        }
      }

    },
    addSubmit(){
      const modal = this.formModal;
      const realoadTable = this.getCategoryList;

      axios
      .post('/bike/category/add', {
        data: this.formData
      })
      .then(function () {
        realoadTable();
        modal.hide();
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    updateSubmit(){
      const modal = this.formModal;
      const realoadTable = this.getCategoryList;

      axios
      .put(`/bike/category/update`, {
        data: this.formData
      })
      .then(function () {
        realoadTable();
        modal.hide();
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    deleteSubmit(){

      const modal = this.dialogModal;
      const realoadTable = this.getCategoryList;
      let list = this.deleteList;

      axios
      .delete('/bike/category/delete', {
        data: list
      })
      .then(function () {
        realoadTable();
        list.splice(0);
        modal.hide();
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    getCategoryList(){

      axios
      .get(`/bike/category`)
      .then( response => {
        this.data = response.data;
      })
      .catch( err => console.error(err) ) 

    },
    openDialogModal(){

      if(this.deleteList.length < 1){
        this.messageModal.condition = 'dialog';
        this.messageModal.message = 'Please select some data';
      }
      else {
        this.messageModal.condition = 'delete';
        this.messageModal.message = 'Are you sure you want to Delete?';
      }

      this.dialogModal.show();
    }

  },
  computed: {

    modalTitle(){
      return this.submitCondition === 'add' ? 'Add Category' : 'Edit Category';
    },
    submitButtonText(){
      return this.submitCondition === 'add' ? 'Save' : 'Update';
    }

  }
}
</script>

<style scoped>
.filter-container >  :not(:last-child) { 
  margin-right: 20px;
}
td:hover {
  cursor: pointer;
}
.th-firstrow {
  text-align: center;
  cursor: pointer;
  width: 50px;
}
</style>

