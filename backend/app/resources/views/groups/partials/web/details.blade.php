<div class="bg-white p-2">
    <h6>Bienvenue chez <b>{{ $group->designation }}</b></h6>
    <div class="my-1">
        <img
            src="{{ asset('/images/cover.jpeg') }}"
            alt="{{ $group->designation }}"
            class="img-fluid rounded"
        >
    </div>
    <div>
        Jour d'ouverture : <strong>Lundi</strong> <strong>Mardi</strong> <strong>Jeudi</strong>
    </div>

    <div>
        Jour de livraison : <strong>Samedi</strong>
    </div>


    <ul class="nav nav-tabs mt-4" id="myTab" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">
                Description
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">
                Info société
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">
                Avis client
            </a>
        </li>
    </ul>
    <div class="tab-content p-2" id="myTabContent">

        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            {{ $group->description }}
        </div>

        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            @foreach($group->adminInfos() as $item)
                <div class="d-flex">
                    <div class="w-25 font-weight-bold text-right">{{ $item['name'] }}</div>
                    <div class="w-100 px-1"> : {{ $item['value'] }}</div>
                </div>
            @endforeach
        </div>
        <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
            Aucun avis clients
        </div>
    </div>
</div>
