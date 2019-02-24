const app = angular.module("Candidate.App", []);

app.component("itmRoot", {
    controller: class {
        constructor() {
            this.candidates = [{ name: "Puppies", votes: 0, percentage: '' }, { name: "Kittens", votes: 0, percentage: '' }, { name: "Gerbils", votes: 0, percentage: '' }];
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
                candidate.percentage = `${(candidate.votes / totalVotes) * 100}% of total`;
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
                alert('already exists')
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
        <h1>Which candidate brings the most joy?</h1>
             
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
                percentage: ''
            };
        }

        submitCandidate(candidate) {
            this.onAdd({ $candidate: candidate });
            //reset form data
            this.newCandidate = {
                name: "",
                votes: 0,
                percentage: ''
            };
        }

        removeCandidate(candidate) {
            this.onRemove({ $candidate: candidate });
        }
    },
    template: `
        <h2>Manage Candidates</h2>

        <h3>Add New Candidate</h3>
        <form ng-submit="$ctrl.submitCandidate($ctrl.newCandidate)" >

            <label>Candidate Name</label>
            <input type="text" ng-model="$ctrl.newCandidate.name" required>

            <button type="submit">Add</button>
        </form>

        <h3>Remove Candidate</h3>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates">
                <span ng-bind="candidate.name"></span>
                <button type="button" ng-click="$ctrl.removeCandidate(candidate)">X</button>
            </li>
        </ul>

    `
});

app.component("itmVote", {
    bindings: {
        candidates: "<",
        onVote: "&"
    },
    controller: class { },
    template: `
        <h2>Cast your vote!</h2>

        <button type="button"
            ng-repeat="candidate in $ctrl.candidates"
            ng-click="$ctrl.onVote({ $candidate: candidate })">
            <span ng-bind="candidate.name"></span>
        </button>
    `
});

app.component("itmResults", {
    bindings: {
        candidates: "<"
    },
    controller: class { },
    template: `
        <h2>Live Results</h2>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates | orderBy: '-votes'">
                <span ng-bind="candidate.name"></span>
                <strong ng-bind="candidate.votes"></strong>
                <strong ng-bind="candidate.percentage"></strong>
            </li>
        </ul>
    `
});
