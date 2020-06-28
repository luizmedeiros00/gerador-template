<template>
  <div>
    <div
      class="my-col"
      style="max-width: 30%"
    >
      <label> Selecione o CSV
        <input
          id="file"
          type="file"
          ref="file"
          accept=".csv"
          @change="handleFile"
          multiple
        />
      </label>
    </div>
    <div
      class="my-col"
      style="max-width: 30%"
    >
      <label>{{labelSelect}}</label>
      <select
        class="form-control"
        v-model="campoMagico"
        @change="insertTextEditor(campoMagico)"
      >
        <option
          v-for="(item, key) in camposMagicos"
          :key="key"
          :value="item"
        >{{item}}</option>
      </select>

    </div>
    <div class="my-col">
      <ckeditor
        :editor="editor"
        v-model="editorData"
        :config="editorConfig"
        @ready="onReady"
      ></ckeditor>
    </div>
    <div class="my-col">
      <button
        class="btn btn-primary"
        @click="enviar"
      >{{labelButton}}</button>
    </div>

  </div>
</template>
<script>
import getKeysJson from './getKeysJson';
import getAsText from './readCsv';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'TemplateBuilder',
  props: {
    engine: {
      type: String,
      default: 'blade',
    },
    fields: {
      type: [Array, Object],
      default: () => ([]),
    },
    labelButton: {
      type: String,
      default: 'Enviar',
    },
    labelSelect: {
      type: String,
      default: 'Campos Mágicos',
    },
  },
  data() {
    return {
      camposMagicos: [],
      campoMagico: '',
      typesEngines: {
        twig: '{{#}}',
        blade: '{{$#}}',
      },
      myObjectEditor: null,
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        autoParagraph: false,
      },
    };
  },
  methods: {
    enviar() {
      const { editorData } = this;
      if (!editorData) {
        alert('Digite algum texto');
        return;
      }
      this.$emit('submit', editorData);
    },
    insertTextEditor(campoMagico) {
      const customField = this.replaceStringEngine(campoMagico);
      this.myObjectEditor.model.change((writer) => {
        writer.insertText(customField,
          this.myObjectEditor.model.document.selection.getFirstPosition());
      });
    },
    handleFile() {
      const { files } = this.$refs.file;
      console.log(files)
      if (files) {
         Array.from(files).forEach((file) => {
          console.log(file)
          getAsText(file).then((res) => {
            const [header] = res;
            this.importArrayToOptions(header);
          });
        });
      }
    },
    replaceStringEngine(string) {
      const stringEngine = this.typesEngines[this.engine];
      return stringEngine.replace('#', string);
    },
    onReady(editor) {
      this.myObjectEditor = editor;
    },
    importArrayToOptions(array) {
      array.forEach((item) => {
        if (this.camposMagicos.indexOf(item) === -1) {
          this.camposMagicos.push(item);
        }
      });
    },
  },
  watch: {
    fields: {
      immediate: true,
      handler(fields) {
        if (fields) {
          this.importArrayToOptions(getKeysJson(fields));
        }
      },
    },
  },
};
</script>
<style scoped>
.my-col {
  flex-basis: 0;
  flex-grow: 1;
  width: 100%;
  padding: 12px;
}
.form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
option {
  font-weight: normal;
  display: block;
  white-space: pre;
  min-height: 1.2em;
  padding: 0px 2px 1px;
}
label {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
}
.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary {
  color: #fff;
  background-color: #0062cc;
  border-color: #005cbf;
}
.btn-primary:hover {
  color: #fff;
  background-color: #0069d9;
  border-color: #0062cc;
}
</style>
