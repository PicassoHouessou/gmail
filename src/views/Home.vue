<template>
    <div>
        <TopBar></TopBar>
        <div class="mailbox-area mg-tb-15">
            <div class="container-fluid">
                <div class="row">
                    <Side></Side>

                    <div class="col-md-9 col-md-9 col-sm-9 col-xs-12 mg-t-15">
                        <div class="hpanel mg-b-15">
                            <div class="panel-heading hbuilt mailbox-hd">
                                <div class="text-center p-xs font-normal">
                                    <div class="input-group">
                                        <input type="text" class="form-control input-sm"
                                               placeholder="Rechercher dans les messages...">
                                        <span class="input-group-btn"> <button type="button"
                                                                               class="btn btn btn-default">Recherche </button></span>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-6 col-md-6 col-sm-6 col-xs-12 mg-b-15">
                                        <div class="btn-group">
                                            <button class="btn btn-default btn-sm"><i class="fa fa-refresh"></i>
                                                Actualiser
                                            </button>
                                            <button class="btn btn-default btn-sm"><i class="fa fa-trash-o"></i>
                                            </button>
                                            <button class="btn btn-default btn-sm"><i class="fa fa-star-o"></i></button>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-md-6 col-sm-6 col-xs-12 mailbox-pagination mg-b-15">
                                        <label style="margin-right: 10px; font-weight: 400;">1-50 sur 100</label>
                                        <div class="btn-group">
                                            <button class="btn btn-default btn-sm"><i class="fa fa-arrow-left"></i>
                                            </button>
                                            <button class="btn btn-default btn-sm"><i class="fa fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
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