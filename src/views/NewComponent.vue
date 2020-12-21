<template>
    <form action="" method="" @submit.prevent="false">
        <div class="hpanel email-compose mg-b-15 border-rounded">
            <div class="panel-heading hbuilt">
                <div class="p-xs h4">
                    Nouveau message
                </div>
            </div>
            <div class="panel-heading hbuilt">
                <div class="p-xs">
                    <div class="form-horizontal" id="composeForm">
                        <div class="form-group">
                            <label class="col-sm-1 control-label text-left">A:</label>
                            <div class="col-sm-11">
                                <input type="text" class="form-control input-sm"
                                       placeholder="example@email.com" v-model="form.to">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-1 control-label text-left">Cc:</label>
                            <div class="col-sm-11">
                                <input type="text" class="form-control input-sm" v-model="form.cc">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-1 control-label text-left">Suject:</label>
                            <div class="col-sm-11">
                                <input type="text" class="form-control input-sm"
                                       placeholder="Entrez le sujet de votre message"
                                       v-model="form.subject">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel-body no-padding">
                <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
            </div>

            <div class="panel-footer">
                <div class="pull-right">
                    <div class="btn-group">
                        <button class="btn btn-default" @click.prevent="save"
                                data-message-label="DRAFT"><i class="fa fa-edit"></i>
                            Enregistrer
                        </button>
                        <button class="btn btn-default" @click.prevent="giveUp"><i
                            class="fa fa-trash"></i>
                            Abandonner
                        </button>
                    </div>
                </div>
                <button class="btn btn-primary ft-compse" @click.prevent="submit">Envoyer</button>
                <div class="btn-group">
                    <button class="btn btn-default"><i class="fa fa-paperclip"></i></button>
                </div>

            </div>
        </div>

    </form>
</template>
<script>
export default {
    name: 'NewComponent',
    props: {
        editor: {},
        editorConfig: {},
        editorData: {},
        form: {},
        giveUp: {},
        save: {},
        submit: {}
    }
}
</script>