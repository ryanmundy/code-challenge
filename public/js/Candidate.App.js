const app = angular.module("Candidate.App", []);

app.component("itmRoot", {
    controller: class {
        constructor() {
            this.candidates = [{ name: "Puppies", votes: 0, percentage: '', color: "black", size: "large" },
            { name: "Kittens", votes: 0, percentage: '', color: "brown", size: "medium" },
            { name: "Gerbils", votes: 0, percentage: '', color: "grey", size: "tiny" }];
        }

        onVote(candidate) {
            console.log(`Vote for ${candidate.name}`);
            //adds to vote totals on click of candidate
            candidate.votes = candidate.votes + 1;
            //loop over candidates and add to total count
            let totalVotes = 0;
            for (candidate of this.candidates) {
                totalVotes = totalVotes + candidate.votes;
            }
            //loop over candidates and calculate percentage of total
            for (candidate of this.candidates) {
                candidate.percentage = `${((candidate.votes / totalVotes) * 100).toFixed(2)}%`;
            }
        }

        onAddCandidate(candidate) {
            console.log(`Added candidate ${candidate.name}`);
            //create array of candidate names
            let candidatesToCheck = []
            for (let i = 0; i < this.candidates.length; i++) {
                candidatesToCheck.push(this.candidates[i].name)
            }
            //check if candidate name is already used
            if (candidatesToCheck.includes(candidate.name)) {
                alert('candidate name already used')
            } else {
                //add new candidate to candidate array using constructor
                this.candidates.push(candidate)
            }
        }

        onRemoveCandidate(candidate) {
            console.log(`Removed candidate ${candidate.name}`);
            //loop over candidates and delete candidate that matches selection
            for (let i = 0; i < this.candidates.length; i++) {
                if (candidate.name === this.candidates[i].name) {
                    this.candidates.splice(i, 1)
                }
            }
        }
    },
    template: `
        <div class="jumbotron">
        <h1>Which candidate brings the most joy?</h1>
        </div>     
        <itm-results 
            candidates="$ctrl.candidates">
        </itm-results>

        <itm-vote 
            candidates="$ctrl.candidates"
            on-vote="$ctrl.onVote($candidate)">
        </itm-vote>

        <itm-management 
            candidates="$ctrl.candidates"
            on-add="$ctrl.onAddCandidate($candidate)"
            on-remove="$ctrl.onRemoveCandidate($candidate)">
        </itm-management>
    `
});

app.component("itmManagement", {
    bindings: {
        candidates: "<",
        onAdd: "&",
        onRemove: "&"
    },
    controller: class {
        constructor() {
            this.newCandidate = {
                name: "",
                votes: 0,
                percentage: '',
                color: '',
                size: ''
            };
        }

        submitCandidate(candidate) {
            this.onAdd({ $candidate: candidate });
            //reset form data
            this.newCandidate = {
                name: "",
                votes: 0,
                percentage: '',
                color: '',
                size: ''
            };
        }

        removeCandidate(candidate) {
            this.onRemove({ $candidate: candidate });
        }
    },
    template: `
        
        <div id="border">
        <h2>Manage Candidates</h2>
        <h3>Add New Candidate</h3>

        <form ng-submit="$ctrl.submitCandidate($ctrl.newCandidate)" >

            <label>Candidate Name</label>
            <input type="text" ng-model="$ctrl.newCandidate.name" required>
            <label>Color</label>
            <input type="text" ng-model="$ctrl.newCandidate.color" required>
            <label>Size</label>
            <input type="text" ng-model="$ctrl.newCandidate.size" required>
            <button type="submit" class="btn btn-secondary">Add</button>
        </form>
        
        <h3>Remove Candidate</h3>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates">
                <span ng-bind="candidate.name"></span>
                <button id="button" class="btn btn-danger" type="button" ng-click="$ctrl.removeCandidate(candidate)">X</button>
            </li>
        </ul>
        </div>
    `
});

app.component("itmVote", {
    bindings: {
        candidates: "<",
        onVote: "&"
    },
    controller: class { },
    template: `
        <div id="border">
        <h2>Cast your vote!</h2>
        <div id="button">
        <button type="button"
            class="btn btn-primary"
            id="button"
            ng-repeat="candidate in $ctrl.candidates"
            ng-click="$ctrl.onVote({ $candidate: candidate })">
            <span ng-bind="candidate.name"></span>
        </button>
        </div>
    `
});

app.component("itmResults", {
    bindings: {
        candidates: "<"
    },
    controller: class { },
    template: `
        <h2>Live Results</h2>
        <table class="table table-striped table-hover" id="table">
        <thead>
            <tr>
            <th scope="col">Name</th>
            <th scope="col">Color</th>
            <th scope="col">Size</th>
            <th scope="col">Votes</th>
            <th scope="col">Percentage of Total</th>
            </tr>
        </thead>
        <tbody>
            <tr ng-repeat="candidate in $ctrl.candidates | orderBy: '-votes'">
            <td><span ng-bind="candidate.name"></span></td>
            <td><span ng-bind="candidate.color"></span></td>
            <td><span ng-bind="candidate.size"></span></td>
            <td><strong ng-bind="candidate.votes"></strong></td>
            <td><strong ng-bind="candidate.percentage"></strong></td>
            </tr>
            `
});
