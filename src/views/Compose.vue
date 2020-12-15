<template>
    <div>
        <TopBar></TopBar>
        <div class="mailbox-area mg-tb-15">
            <div class="container-fluid">
                <div class="row">
                    <Side></Side>
                    <div class="col-md-9 col-md-9 col-sm-9 col-xs-12 mg-t-15">
                        <div class="hpanel email-compose mg-b-15 border-rounded">
                            <div class="panel-heading hbuilt">
                                <div class="p-xs h4">
                                    Nouveau message
                                </div>
                            </div>
                            <div class="panel-heading hbuilt">
                                <div class="p-xs">
                                    <form method="get" class="form-horizontal">
                                        <div class="form-group">
                                            <label class="col-sm-1 control-label text-left">A:</label>
                                            <div class="col-sm-11">
                                                <input type="text" class="form-control input-sm" placeholder="example@email.com">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-1 control-label text-left">Cc:</label>
                                            <div class="col-sm-11">
                                                <input type="text" class="form-control input-sm">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-1 control-label text-left">Suject:</label>
                                            <div class="col-sm-11">
                                                <input type="text" class="form-control input-sm" placeholder="Entrez le sujet de votre message">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div class="panel-body no-padding">
                                <div class="summernote6">
                                    <h5>Hello Jonathan! </h5>
                                    <p>Dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the dustrys</strong> standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
                                        a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more
                                        <br/>
                                        <br/>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with
                                        a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. recently with.</p>
                                    <p>Mark Smith
                                    </p>
                                </div>
                            </div>

                            <div class="panel-footer">
                                <div class="pull-right">
                                    <div class="btn-group">
                                        <button class="btn btn-default"><i class="fa fa-edit"></i> Enregistrer</button>
                                        <button class="btn btn-default"><i class="fa fa-trash"></i> Abandonner</button>
                                    </div>
                                </div>
                                <button class="btn btn-primary ft-compse">Envoyer</button>
                                <div class="btn-group">
                                    <button class="btn btn-default"><i class="fa fa-paperclip"></i> </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import TopBar from "../components/TopBar";
import Side from "../components/Side" ;
import Footer from "../components/Footer";

export default {
    name: 'Home',
    components: {
        TopBar,
        Side,
        Footer
    }
}

</script>