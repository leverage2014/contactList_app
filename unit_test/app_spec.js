describe('contactListApp', function(){

	describe('listCtrl', function(){

		var $rootScope,
			scope,
			controller;

		beforeEach(function(){
			module('contactListApp');

			inject(function($injector){
				$rootScope = $injector.get('$rootScope');
				scope = $rootScope.$new();
				controller = $injector.get('$controller')('listCtrl', {$scope: scope});
			});
		});

		it('greeting should be defined', function(){
			expect(scope.greeting).toBeDefined();
		});

		it('greeting should have value', function(){
			expect(scope.greeting).toEqual('Contact List App');
		});

	});
});